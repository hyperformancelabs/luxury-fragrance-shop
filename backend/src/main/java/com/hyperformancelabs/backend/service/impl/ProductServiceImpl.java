package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;


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

    @Autowired
    private ProductVariantRepository productVariantRepository;

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
                    volumePriceList
            );

            response.add(productResponse);
        }

        return response;
    }

    @Override
    public List<ProductCard> getFlashSaleProducts() {
        List<ProductVariant> productVariants = productVariantRepository.findAll();

        List<ProductVariant> flashSaleVariants = productVariants.stream()
                .filter(variant -> variant.getProduct().getProductId() != null)
                .filter(variant -> variant.getProduct().getProductId() >= 1 && variant.getProduct().getProductId() <= 10)
                .collect(Collectors.toList());

        Map<Integer, List<ProductVariant>> groupedByProduct = flashSaleVariants.stream()
                .collect(Collectors.groupingBy(variant -> variant.getProduct().getProductId()));

        List<ProductCard> response = new ArrayList<>();

        for (Map.Entry<Integer, List<ProductVariant>> entry : groupedByProduct.entrySet()) {
            Integer productId = entry.getKey();
            List<ProductVariant> variants = entry.getValue();

            List<VolumePriceDTO> volumePrices = variants.stream()
                    .map(variant -> new VolumePriceDTO(variant.getProductVariantId(),variant.getVolume(), variant.getPrice()))
                    .collect(Collectors.toList());

            Product product = variants.get(0).getProduct(); // Tất cả variant cùng product

            ProductCard productCard = new ProductCard(
                    productId,
                    product.getProductName(),
                    product.getImageUrl(),
                    volumePrices
            );

            response.add(productCard);
        }

        return response;
    }
}
