package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductCreateRequest;
import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductListResponse;
import com.hyperformancelabs.backend.dto.ProductUpdateRequest;
import org.springframework.data.domain.Sort;

import java.util.Map;

public interface ProductManagementService {
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
    ProductListResponse getAllProducts(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters);
    
    /**
     * Get a specific product by ID
     *
     * @param productId        Product ID
     * @return                 Product details
     */
    ProductDTO getProductById(Integer productId);
    
    /**
     * Create a new product
     *
     * @param request          Product create request
     * @return                 Created product details
     */
    ProductDTO createProduct(ProductCreateRequest request);
    
    /**
     * Update an existing product
     *
     * @param productId        Product ID
     * @param request          Product update request
     * @return                 Updated product details
     */
    ProductDTO updateProduct(Integer productId, ProductUpdateRequest request);
    
    /**
     * Delete a product
     *
     * @param productId        Product ID
     */
    void deleteProduct(Integer productId);
} 