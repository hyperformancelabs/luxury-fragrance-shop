package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ProductVariantCreateRequest;
import com.hyperformancelabs.backend.dto.ProductVariantDTO;
import com.hyperformancelabs.backend.dto.ProductVariantListResponse;
import com.hyperformancelabs.backend.dto.ProductVariantUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.ProductVariantService;
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
@RequestMapping("/emp/products/{productId}/variants")
public class ProductVariantController {

    private static final Logger logger = LoggerFactory.getLogger(ProductVariantController.class);

    @Autowired
    private ProductVariantService productVariantService;

    /**
     * Lấy tất cả biến thể của một sản phẩm với phân trang
     *
     * @param productId ID của sản phẩm
     * @param page Số trang (bắt đầu từ 0)
     * @param size Kích thước trang
     * @param sortBy Trường sắp xếp (mặc định: "volume")
     * @param sortDir Hướng sắp xếp ("asc" hoặc "desc", mặc định: "asc")
     * @return Danh sách biến thể có phân trang
     */
    @GetMapping
    @PreAuthorize("hasAuthority('product.view')")
    public ResponseEntity<ApiResponse<ProductVariantListResponse>> getProductVariants(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "volume") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        try {
            // Tạo map chứa các tiêu chí lọc (hiện tại chưa dùng)
            Map<String, String> filters = new HashMap<>();
            
            // Xác định hướng sắp xếp
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                    Sort.Direction.DESC : Sort.Direction.ASC;
            
            // Gọi service để lấy danh sách biến thể
            ProductVariantListResponse response = productVariantService.getProductVariants(
                    productId, page, size, sortBy, direction, filters);
            
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy danh sách biến thể thành công",
                    response
            ));
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error getting product variants: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy danh sách biến thể: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Lấy chi tiết một biến thể sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param variantId ID của biến thể
     * @return Chi tiết biến thể
     */
    @GetMapping("/{variantId}")
    @PreAuthorize("hasAuthority('product.view')")
    public ResponseEntity<ApiResponse<ProductVariantDTO>> getProductVariant(
            @PathVariable Integer productId,
            @PathVariable Integer variantId) {
        try {
            ProductVariantDTO variant = productVariantService.getProductVariant(productId, variantId);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy thông tin biến thể thành công",
                    variant
            ));
        } catch (ResourceNotFoundException e) {
            logger.error("Variant not found: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error getting product variant: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy thông tin biến thể: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Tạo mới biến thể sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param request Thông tin yêu cầu tạo biến thể
     * @return Chi tiết biến thể đã tạo
     */
    @PostMapping
    @PreAuthorize("hasAuthority('product.create')")
    public ResponseEntity<ApiResponse<ProductVariantDTO>> createProductVariant(
            @PathVariable Integer productId,
            @Valid @RequestBody ProductVariantCreateRequest request) {
        try {
            ProductVariantDTO createdVariant = productVariantService.createProductVariant(productId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Tạo biến thể thành công",
                    createdVariant
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when creating variant: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate variant: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error creating product variant: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi tạo biến thể: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Cập nhật biến thể sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param variantId ID của biến thể
     * @param request Thông tin yêu cầu cập nhật
     * @return Chi tiết biến thể đã cập nhật
     */
    @PutMapping("/{variantId}")
    @PreAuthorize("hasAuthority('product.edit')")
    public ResponseEntity<ApiResponse<ProductVariantDTO>> updateProductVariant(
            @PathVariable Integer productId,
            @PathVariable Integer variantId,
            @Valid @RequestBody ProductVariantUpdateRequest request) {
        try {
            ProductVariantDTO updatedVariant = productVariantService.updateProductVariant(
                    productId, variantId, request);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Cập nhật biến thể thành công",
                    updatedVariant
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when updating variant: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate variant: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error updating product variant: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi cập nhật biến thể: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Xóa biến thể sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param variantId ID của biến thể
     * @return Thông báo thành công
     */
    @DeleteMapping("/{variantId}")
    @PreAuthorize("hasAuthority('product.delete')")
    public ResponseEntity<ApiResponse<Void>> deleteProductVariant(
            @PathVariable Integer productId,
            @PathVariable Integer variantId) {
        try {
            productVariantService.deleteProductVariant(productId, variantId);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Xóa biến thể thành công",
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when deleting variant: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error deleting product variant: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi xóa biến thể: " + e.getMessage(),
                    null
                )
            );
        }
    }
} 