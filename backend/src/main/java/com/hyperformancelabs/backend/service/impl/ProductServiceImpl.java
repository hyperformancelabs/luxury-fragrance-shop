package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductDetail;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.payload.PagedResponse;
import com.hyperformancelabs.backend.repository.ProductDetailRepository;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setBrandName(product.getBrand().getBrandName());
        dto.setProductName(product.getProductName());
        dto.setDescription(product.getDescription());
        if (!product.getProductVariants().isEmpty()) {
            ProductVariant firstVariant = product.getProductVariants().iterator().next();
            dto.setVolume(firstVariant.getVolume());
            dto.setPrice(firstVariant.getPrice());
            dto.setDiscountPrice(firstVariant.getDiscountPrice());
            dto.setQuantityInStock(firstVariant.getQuantityInStock());
            dto.setReorderLevel(firstVariant.getReorderLevel());
        } else {
            dto.setVolume(null);
            dto.setPrice(null);
            dto.setDiscountPrice(null);
            dto.setQuantityInStock(0);
            dto.setReorderLevel(null);
        }
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }

    @Override
    public Page<ProductDTO> getAllProducts(int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertToDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByBrand(String brandName, int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Product> productPage = productRepository.findByBrand_BrandName(brandName, pageable);
        return productPage.map(this::convertToDTO);
    }

    @Override
    public List<TopSellingProductDTO> getTopSellingProducts(String category, int limit) {
        List<Object[]> results = productRepository.findTop10TopSellingProducts(category);
        return results.stream()
                .map(result -> new TopSellingProductDTO(
                        (Integer) result[0],            // productVariant.product_variant_id
                        (String) result[1],             // p.product_name
                        (String) result[2],             // b.brand_name
                        (Integer) result[3],            // productVariant.volume
                        (BigDecimal) result[4],         // productVariant.price
                        (String) result[5],             // p.image_url
                        ((Number) result[6]).intValue() // SUM(oi.quantity)
                ))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDTO> findByProductNameContainingIgnoreCase(String productName, Pageable pageable) {
        Page<Product> productPage = productRepository.findByProductNameContainingIgnoreCase(productName, pageable);
        return productPage.map(this::convertToDTO);
    }

    @Override
    public List<Random10Product> getRandom10Product() {

        List<Product> allProducts = productRepository.findAll();
        Collections.shuffle(allProducts);

        return allProducts.stream()
                .limit(10)
                .filter(product -> !product.getProductVariants().isEmpty())
                .map(product -> {
                    ProductVariant variant = product.getProductVariants().iterator().next();
                    return new Random10Product(
                            product.getProductId(),
                            product.getProductName(),
                            product.getBrand().getBrandName(),
                            variant.getVolume(),
                            variant.getPrice(),
                            product.getImageUrl()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<ProductCard> getProductVariantsGroupedByProduct() {

        List<ProductVariant> productVariants = productVariantRepository.findAll();
        Map<Integer, List<ProductVariant>> groupedByProduct = productVariants.stream()
                .collect(Collectors.groupingBy(variant -> variant.getProduct().getProductId()));

        List<ProductCard> response = new ArrayList<>();
        for (Map.Entry<Integer, List<ProductVariant>> entry : groupedByProduct.entrySet()) {
            Integer productId = entry.getKey();
            List<ProductVariant> variants = entry.getValue();

            List<VolumePriceDTO> volumePriceList = variants.stream()
                    .map(variant -> new VolumePriceDTO(
                            variant.getProductVariantId(),
                            variant.getVolume(),
                            variant.getPrice()

                    ))
                    .collect(Collectors.toList());

            Product product = variants.get(0).getProduct();

            ProductCard productResponse = new ProductCard(
                    productId,
                    product.getProductName(),
                    product.getImageUrl(),
                    volumePriceList,
                    product.getBrand().getBrandName(),
                    product.getBrand().getCountryOfOrigin()
            );

            response.add(productResponse);
        }

        return response;
    }

    @Override
    @Transactional
    public PagedResponse<ProductCard> getProductVariantsByBrandNamePaged(String brandName, int pageNumber) {
        final int pageSize = 25;

        List<ProductVariant> productVariants = productVariantRepository.findAll();

        List<ProductVariant> filteredByBrand = productVariants.stream()
                .filter(variant -> variant.getProduct().getBrand().getBrandName().equalsIgnoreCase(brandName))
                .collect(Collectors.toList());

        Map<Integer, List<ProductVariant>> groupedByProduct = filteredByBrand.stream()
                .collect(Collectors.groupingBy(variant -> variant.getProduct().getProductId()));

        List<ProductCard> productCards = new ArrayList<>();
        for (Map.Entry<Integer, List<ProductVariant>> entry : groupedByProduct.entrySet()) {
            Integer productId = entry.getKey();
            List<ProductVariant> variants = entry.getValue();

            List<VolumePriceDTO> volumePriceList = variants.stream()
                    .map(variant -> new VolumePriceDTO(
                            variant.getProductVariantId(),
                            variant.getVolume(),
                            variant.getPrice()
                    ))
                    .collect(Collectors.toList());

            Product product = variants.get(0).getProduct();

            ProductCard productResponse = new ProductCard(
                    productId,
                    product.getProductName(),
                    product.getImageUrl(),
                    volumePriceList,
                    product.getBrand().getBrandName(),
                    product.getBrand().getCountryOfOrigin()
            );

            productCards.add(productResponse);
        }

        int totalItems = productCards.size();
        int fromIndex = pageNumber * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalItems);

        List<ProductCard> pagedList = (fromIndex >= totalItems)
                ? new ArrayList<>()
                : productCards.subList(fromIndex, toIndex);

        return new PagedResponse<>(pagedList, pageNumber, pageSize, totalItems);
    }

    @Override
    public List<ProductCard> getFilteredFlashSaleProducts(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer volume,
            String brandName,
            String suitableGender,
            String style,
            String toneScent
    ) {
        Specification<Product> spec = ProductSpecification.buildFilter(
                minPrice, maxPrice, volume, brandName, suitableGender, style, toneScent
        );

        // Chỉ lấy productId từ 1–10 (flash sale)
        Specification<Product> flashSaleSpec = (root, query, cb) ->
                cb.between(root.get("productId"), 1, 10);

        List<Product> products = productRepository.findAll(spec.and(flashSaleSpec));

        // Build ProductCard
        List<ProductCard> response = new ArrayList<>();
        for (Product product : products) {
            List<VolumePriceDTO> volumePrices = product.getProductVariants().stream()
                    .map(v -> new VolumePriceDTO(v.getProductVariantId(), v.getVolume(), v.getPrice()))
                    .collect(Collectors.toList());

            ProductCard card = new ProductCard(
                    product.getProductId(),
                    product.getProductName(),
                    product.getImageUrl(),
                    volumePrices,
                    product.getBrand().getBrandName(),
                    product.getBrand().getCountryOfOrigin()
            );

            response.add(card);
        }

        return response;
    }

    @Override
    @Transactional
    public ProductDetailDTO getProductDetailById(Integer productId) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

            String brandName = product.getBrand() != null ? product.getBrand().getBrandName() : "Unknown";

            List<ProductDetail> details = productDetailRepository.findByProduct_ProductId(productId);
            List<ProductDetailInfoDTO> productDetails = details.stream()
                    .map(detail -> new ProductDetailInfoDTO(
                            detail.getDetailName(), 
                            detail.getDetailValue()))
                    .collect(Collectors.toList());

            String country = details.stream()
                    .filter(detail -> "country".equalsIgnoreCase(detail.getDetailName()))
                    .map(ProductDetail::getDetailValue)
                    .findFirst()
                    .orElse("Unknown");

            List<ProductVariant> variants = productVariantRepository.findByProduct_ProductId(productId);
            List<VolumePriceDTO> volumePrices = variants.stream()
                    .map(variant -> new VolumePriceDTO(
                            variant.getProductVariantId(),
                            variant.getVolume(),
                            variant.getPrice()))
                    .collect(Collectors.toList());

            return new ProductDetailDTO(
                    product.getProductId(),
                    product.getProductName(),
                    product.getImageUrl(),
                    volumePrices,
                    country,
                    brandName,
                    productDetails
            );
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error getting product details for ID: " + productId, e);
            throw new RuntimeException("Failed to retrieve product details: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public PagedResponse<ProductCard> getProductVariantsByGenderPaged(String gender, int pageNumber) {
        final int pageSize = 25;

        // 🔄 Lấy ProductVariants theo gender từ database
        List<ProductVariant> filteredVariants = productVariantRepository.findByProductGender(gender);

        // ✅ Gom theo productId
        Map<Integer, List<ProductVariant>> groupedByProduct = filteredVariants.stream()
                .collect(Collectors.groupingBy(variant -> variant.getProduct().getProductId()));

        // 🔄 Dựng danh sách ProductCard
        List<ProductCard> productCards = new ArrayList<>();
        for (Map.Entry<Integer, List<ProductVariant>> entry : groupedByProduct.entrySet()) {
            Integer productId = entry.getKey();
            List<ProductVariant> variants = entry.getValue();

            List<VolumePriceDTO> volumePriceList = variants.stream()
                    .map(variant -> new VolumePriceDTO(
                            variant.getProductVariantId(),
                            variant.getVolume(),
                            variant.getPrice()
                    ))
                    .collect(Collectors.toList());

            Product product = variants.get(0).getProduct();

            ProductCard productResponse = new ProductCard(
                    productId,
                    product.getProductName(),
                    product.getImageUrl(),
                    volumePriceList,
                    product.getBrand().getBrandName(),
                    product.getBrand().getCountryOfOrigin()
            );

            productCards.add(productResponse);
        }


        int totalItems = productCards.size();
        int fromIndex = pageNumber * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalItems);

        List<ProductCard> pagedList = (fromIndex >= totalItems)
                ? new ArrayList<>()
                : productCards.subList(fromIndex, toIndex);

        return new PagedResponse<>(pagedList, pageNumber, pageSize, totalItems);
    }

    @Override
    public List<ProductCard> filterProducts(FilterRequestDTO request) {
        Specification<ProductVariant> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Brand filter
            if (request.getBrands() != null && !request.getBrands().isEmpty()) {
                predicates.add(root.get("product").get("brand").get("brandName").in(request.getBrands()));
            }
            // Volume filter
            if (request.getVolumes() != null && !request.getVolumes().isEmpty()) {
                predicates.add(root.get("volume").in(request.getVolumes()));
            }
            // Price range filter
            if (request.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.getMaxPrice()));
            }
            // ProductDetail filters
            if (request.getProductDetails() != null && !request.getProductDetails().isEmpty()) {
                Join<ProductVariant, Product> productJoin = root.join("product");
                for (Map.Entry<String, List<String>> e : request.getProductDetails().entrySet()) {
                    String dbName = toSnakeCase(e.getKey());
                    List<String> values = e.getValue();
                    if (values != null && !values.isEmpty()) {
                        Join<Product, ProductDetail> detailJoin = productJoin.join("productDetails");
                        predicates.add(cb.and(
                            cb.equal(detailJoin.get("detailName"), dbName),
                            detailJoin.get("detailValue").in(values)
                        ));
                    }
                }
            }
            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        // Fetch variants matching spec
        List<ProductVariant> variants = productVariantRepository.findAll(spec);
        // Group by product
        Map<Integer, List<ProductVariant>> grouped = variants.stream()
            .collect(Collectors.groupingBy(v -> v.getProduct().getProductId()));
        // Build ProductCard list
        return grouped.entrySet().stream().map(entry -> {
            List<VolumePriceDTO> vp = entry.getValue().stream()
                .map(v -> new VolumePriceDTO(v.getProductVariantId(), v.getVolume(), v.getPrice()))
                .collect(Collectors.toList());
            Product p = entry.getValue().get(0).getProduct();
            return new ProductCard(p.getProductId(), p.getProductName(), p.getImageUrl(), vp,p.getBrand().getBrandName() ,p.getBrand().getCountryOfOrigin());
        }).collect(Collectors.toList());
    }

    private String toSnakeCase(String camel) {
        return camel.replaceAll("([a-z])([A-Z]+)", "$1_$2").toLowerCase();
    }
}
