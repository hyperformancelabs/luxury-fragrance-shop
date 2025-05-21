package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductListResponse;
import com.hyperformancelabs.backend.dto.Random10Product;
import com.hyperformancelabs.backend.dto.SearchResponseDto;
import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Map;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Chuyển từ Product sang ProductDTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setBrandName(product.getBrand().getBrandName());
        dto.setProductName(product.getProductName());
        dto.setDescription(product.getDescription());
        // Các trường volume, price, discountPrice, quantityInStock, reorderLevel không còn thuộc Product
        // mà thuộc về ProductVariant. Hiển thị giá trị mặc định hoặc lấy từ variant đầu tiên nếu có
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

    // Phân trang tất cả sản phẩm
    @Override
    public Page<ProductDTO> getAllProducts(int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertToDTO);
    }
    
    /**
     * Get all products with pagination, sorting, and filtering
     *
     * @param page             Page number (0-based)
     * @param size             Page size
     * @param sortBy           Field to sort by
     * @param sortDirection    Sort direction (ASC/DESC)
     * @param filters          Map of filter criteria
     * @return                 ProductListResponse containing products and pagination info
     */
    @Override
    public ProductListResponse getAllProducts(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        // This method should be implemented by the ProductManagementService
        // For now, returning a minimal implementation to satisfy the interface
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Product> productPage = productRepository.findAll(pageable);
        
        List<ProductDTO> productDTOs = productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new ProductListResponse(
                productDTOs,
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.getNumber()
        );
    }
    
    /**
     * Get a specific product by ID
     *
     * @param productId        Product ID
     * @return                 Product details
     */
    @Override
    public ProductDTO getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return convertToDTO(product);
    }

    // Phân trang theo brand
    @Override
    public Page<ProductDTO> getProductsByBrand(String brandName, int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Product> productPage = productRepository.findByBrand_BrandName(brandName, pageable);
        return productPage.map(this::convertToDTO);
    }

    // Sản phẩm bán chạy nhất (có thông tin số lượng đã bán)
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
    
    /**
     * Get top K best-selling products within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @param category Optional category filter (suitable_gender)
     * @param limit Number of top products to return
     * @return List of top selling products with sales quantity
     */
    @Override
    public List<TopSellingProductDTO> getTopSellingProductsByDateRange(String startDate, String endDate, String category, int limit) {
        List<Object[]> results = productRepository.findTopSellingProductsByDateRange(startDate, endDate, category, limit);
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

    // Tìm sản phẩm theo tên (phân trang)
    @Override
    public Page<ProductDTO> findByProductNameContainingIgnoreCase(String productName, Pageable pageable) {
        Page<Product> productPage = productRepository.findByProductNameContainingIgnoreCase(productName, pageable);
        return productPage.map(this::convertToDTO);
    }


    @Override
    public List<Random10Product> getRandom10Product() {
        // Lấy toàn bộ danh sách sản phẩm từ database
        List<Product> allProducts = productRepository.findAll();

        // Shuffle để ngẫu nhiên thứ tự
        Collections.shuffle(allProducts);

        // Lấy 10 sản phẩm đầu tiên sau khi random
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
    
    /**
     * Search products by name for autocomplete
     * 
     * @param searchTerm The search term to match against product names
     * @param limit Maximum number of results to return
     * @return SearchResponseDto containing matching products and whether there's an exact match
     */
    @Override
    public SearchResponseDto<ProductDTO> searchProductsByName(String searchTerm, int limit) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // If search term is empty, return recent products
            List<ProductDTO> recentProducts = productRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "productId")))
                    .getContent()
                    .stream()
                    // Map minimal fields for autocomplete without loading variants
                    .map(p -> {
                        ProductDTO dto = new ProductDTO();
                        dto.setProductId(p.getProductId());
                        dto.setProductName(p.getProductName());
                        dto.setBrandName(p.getBrand().getBrandName());
                        return dto;
                    })
                    .collect(Collectors.toList());
            return new SearchResponseDto<>(recentProducts, false);
        }

        // Search for products matching the search term using built-in method with pagination
        Page<Product> productPage = productRepository.findByProductNameContainingIgnoreCase(
                searchTerm.trim(), PageRequest.of(0, limit));
        List<Product> matchingProducts = productPage.getContent();

        // Check if there's an exact match - only consider it exact if it matches the complete product name
        boolean hasExactMatch = matchingProducts.stream()
                .anyMatch(product -> product.getProductName().equalsIgnoreCase(searchTerm.trim()));

        // Sort by relevance and convert to DTOs without loading variants
        List<ProductDTO> productDtos = matchingProducts.stream()
                .sorted((a, b) -> {
                    // Exact matches first
                    boolean aExact = a.getProductName().equalsIgnoreCase(searchTerm.trim());
                    boolean bExact = b.getProductName().equalsIgnoreCase(searchTerm.trim());
                    if (aExact && !bExact) return -1;
                    if (!aExact && bExact) return 1;

                    // Starts with matches next
                    boolean aStartsWith = a.getProductName().toLowerCase().startsWith(searchTerm.trim().toLowerCase());
                    boolean bStartsWith = b.getProductName().toLowerCase().startsWith(searchTerm.trim().toLowerCase());
                    if (aStartsWith && !bStartsWith) return -1;
                    if (!aStartsWith && bStartsWith) return 1;

                    // Alphabetical order for the rest
                    return a.getProductName().compareToIgnoreCase(b.getProductName());
                })
                .limit(limit)
                // Map minimal fields for autocomplete
                .map(p -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setProductId(p.getProductId());
                    dto.setProductName(p.getProductName());
                    dto.setBrandName(p.getBrand().getBrandName());
                    return dto;
                })
                .collect(Collectors.toList());

        return new SearchResponseDto<>(productDtos, hasExactMatch);
    }

}
