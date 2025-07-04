package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ProductCreateRequest;
import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductListResponse;
import com.hyperformancelabs.backend.dto.ProductUpdateRequest;
import com.hyperformancelabs.backend.dto.SearchResponseDto;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.ProductManagementService;
import com.hyperformancelabs.backend.service.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/emp/products")
public class ProductManagementController {

    private static final Logger logger = LoggerFactory.getLogger(ProductManagementController.class);

    @Autowired
    private ProductManagementService productManagementService;
    
    @Autowired
    private ProductService productService;

    /**
     * Get all products with pagination, sorting, and filtering
     *
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Field to sort by (default: "productId")
     * @param sortDir Sort direction ("asc" or "desc", default: "asc")
     * @param brandId Filter by brand ID (optional)
     * @param productName Filter by product name (optional)
     * @return Paginated list of products
     */
    @GetMapping
    @PreAuthorize("hasAuthority('product.view')")
    public ResponseEntity<ApiResponse<ProductListResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) String productName) {
        
        try {
            // Create a map to hold the filter criteria
            Map<String, String> filters = new HashMap<>();
            if (brandId != null) {
                filters.put("brandId", brandId.toString());
            }
            if (productName != null && !productName.trim().isEmpty()) {
                filters.put("productName", productName.trim());
            }
            
            // Determine sort direction
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                    Sort.Direction.DESC : Sort.Direction.ASC;
            
            // Call service to get products
            ProductListResponse response = productManagementService.getAllProducts(
                    page, size, sortBy, direction, filters);
            
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy danh sách sản phẩm thành công",
                    response
            ));
        } catch (Exception e) {
            logger.error("Error getting products: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy danh sách sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Get a product by ID
     *
     * @param productId Product ID
     * @return Product details
     */
    @GetMapping("/{productId}")
    @PreAuthorize("hasAuthority('product.view')")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Integer productId) {
        try {
            ProductDTO product = productManagementService.getProductById(productId);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy thông tin sản phẩm thành công",
                    product
            ));
        } catch (ResourceNotFoundException e) {
            logger.error("Product not found: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error getting product with ID {}: ", productId, e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy thông tin sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Create a new product
     *
     * @param request Product create request
     * @return Created product details
     */
    @PostMapping
    @PreAuthorize("hasAuthority('product.create')")
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        try {
            ProductDTO createdProduct = productManagementService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Tạo sản phẩm thành công",
                    createdProduct
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when creating product: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate product: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error creating product: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi tạo sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Update a product
     *
     * @param productId Product ID
     * @param request Product update request
     * @return Updated product details
     */
    @PutMapping("/{productId}")
    @PreAuthorize("hasAuthority('product.edit')")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Integer productId,
            @Valid @RequestBody ProductUpdateRequest request) {
        try {
            ProductDTO updatedProduct = productManagementService.updateProduct(productId, request);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Cập nhật sản phẩm thành công",
                    updatedProduct
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when updating product: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate product: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error updating product with ID {}: ", productId, e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi cập nhật sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Search products by name for autocomplete
     * 
     * @param query The search term to match against product names
     * @param limit Maximum number of results to return
     * @return SearchResponseDto containing matching products and whether there's an exact match
     */
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('product.view')")
    public ResponseEntity<ApiResponse<SearchResponseDto<ProductDTO>>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            SearchResponseDto<ProductDTO> searchResults = productService.searchProductsByName(query, limit);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Tìm kiếm sản phẩm thành công",
                    searchResults
                )
            );
        } catch (Exception e) {
            logger.error("Error searching products: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi tìm kiếm sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Delete a product
     *
     * @param productId Product ID
     * @return Success message
     */
    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAuthority('product.delete')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer productId) {
        try {
            productManagementService.deleteProduct(productId);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Xóa sản phẩm thành công",
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when deleting product: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error deleting product with ID {}: ", productId, e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi xóa sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
} 