package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ProductDetailCreateRequest;
import com.hyperformancelabs.backend.dto.ProductDetailDTO;
import com.hyperformancelabs.backend.dto.ProductDetailListResponse;
import com.hyperformancelabs.backend.dto.ProductDetailUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.ProductDetailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emp/products/{productId}/details")
public class ProductDetailController {

    private static final Logger logger = LoggerFactory.getLogger(ProductDetailController.class);

    @Autowired
    private ProductDetailService productDetailService;

    /**
     * Lấy tất cả chi tiết của một sản phẩm
     *
     * @param productId ID của sản phẩm
     * @return Danh sách chi tiết sản phẩm
     */
    @GetMapping
    @PreAuthorize("hasAuthority('product.view')")
    public ResponseEntity<ApiResponse<ProductDetailListResponse>> getProductDetails(
            @PathVariable Integer productId) {
        
        try {
            ProductDetailListResponse response = productDetailService.getProductDetails(productId);
            
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy danh sách chi tiết sản phẩm thành công",
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
            logger.error("Error getting product details: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy danh sách chi tiết sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Tạo mới chi tiết sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param request Thông tin yêu cầu tạo chi tiết
     * @return Chi tiết sản phẩm đã tạo
     */
    @PostMapping
    @PreAuthorize("hasAuthority('product.create')")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> createProductDetail(
            @PathVariable Integer productId,
            @Valid @RequestBody ProductDetailCreateRequest request) {
        try {
            ProductDetailDTO createdDetail = productDetailService.createProductDetail(productId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Tạo chi tiết sản phẩm thành công",
                    createdDetail
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when creating detail: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate detail: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error creating product detail: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi tạo chi tiết sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Cập nhật chi tiết sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param detailId ID của chi tiết sản phẩm
     * @param request Thông tin yêu cầu cập nhật
     * @return Chi tiết sản phẩm đã cập nhật
     */
    @PutMapping("/{detailId}")
    @PreAuthorize("hasAuthority('product.edit')")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> updateProductDetail(
            @PathVariable Integer productId,
            @PathVariable Integer detailId,
            @Valid @RequestBody ProductDetailUpdateRequest request) {
        try {
            ProductDetailDTO updatedDetail = productDetailService.updateProductDetail(
                    productId, detailId, request);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Cập nhật chi tiết sản phẩm thành công",
                    updatedDetail
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when updating detail: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate detail: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error updating product detail: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi cập nhật chi tiết sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Xóa chi tiết sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param detailId ID của chi tiết sản phẩm
     * @return Thông báo thành công
     */
    @DeleteMapping("/{detailId}")
    @PreAuthorize("hasAuthority('product.delete')")
    public ResponseEntity<ApiResponse<Void>> deleteProductDetail(
            @PathVariable Integer productId,
            @PathVariable Integer detailId) {
        try {
            productDetailService.deleteProductDetail(productId, detailId);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Xóa chi tiết sản phẩm thành công",
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when deleting detail: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error deleting product detail: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi xóa chi tiết sản phẩm: " + e.getMessage(),
                    null
                )
            );
        }
    }
} 