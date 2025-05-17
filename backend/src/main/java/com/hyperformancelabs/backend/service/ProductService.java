package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductListResponse;
import com.hyperformancelabs.backend.dto.Random10Product;
import com.hyperformancelabs.backend.dto.SearchResponseDto;
import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

public interface ProductService {
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

    Page<ProductDTO> getAllProducts(int page);

    Page<ProductDTO> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);

    Page<ProductDTO> getProductsByBrand(String brandName, int page);

    List<TopSellingProductDTO> getTopSellingProducts(String category, int limit);
    
    /**
     * Get top K best-selling products within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @param category Optional category filter (suitable_gender)
     * @param limit Number of top products to return
     * @return List of top selling products with sales quantity
     */
    List<TopSellingProductDTO> getTopSellingProductsByDateRange(String startDate, String endDate, String category, int limit);

    List<Random10Product> getRandom10Product();
    
    /**
     * Search products by name for autocomplete
     * 
     * @param searchTerm The search term to match against product names
     * @param limit Maximum number of results to return
     * @return SearchResponseDto containing matching products and whether there's an exact match
     */
    SearchResponseDto<ProductDTO> searchProductsByName(String searchTerm, int limit);
}
