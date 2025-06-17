package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.PromotionCreateRequest;
import com.hyperformancelabs.backend.dto.PromotionDTO;
import com.hyperformancelabs.backend.dto.PromotionListResponse;
import com.hyperformancelabs.backend.dto.PromotionUpdateRequest;
import com.hyperformancelabs.backend.dto.ProductPromotionCreateRequest;
import com.hyperformancelabs.backend.dto.ProductPromotionDTO;
import com.hyperformancelabs.backend.dto.PromotionInventorySummaryDTO;
import com.hyperformancelabs.backend.dto.PromotionSalesSummaryDTO;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.PromotionManagementService;
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
@RequestMapping("/emp/promotions")
public class PromotionManagementController {

    private static final Logger logger = LoggerFactory.getLogger(PromotionManagementController.class);

    @Autowired
    private PromotionManagementService promotionManagementService;

    // Get all promotions
    @GetMapping
    @PreAuthorize("hasAuthority('promotion.view')")
    public ResponseEntity<ApiResponse<PromotionListResponse>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "promotionId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String promotionName,
            @RequestParam(required = false) String status) {
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Map<String, String> filters = new HashMap<>();
            if (promotionName != null && !promotionName.trim().isEmpty()) {
                filters.put("promotionName", promotionName.trim());
            }
            if (status != null && !status.trim().isEmpty()) {
                filters.put("status", status.trim());
            }
            PromotionListResponse response = promotionManagementService.getAllPromotions(page, size, sortBy, direction, filters);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy danh sách khuyến mãi thành công",
                    response));
        } catch (Exception e) {
            logger.error("Error getting promotions", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        }
    }

    // Get promotion by id
    @GetMapping("/{promotionId}")
    @PreAuthorize("hasAuthority('promotion.view')")
    public ResponseEntity<ApiResponse<PromotionDTO>> getPromotionById(@PathVariable Integer promotionId) {
        try {
            PromotionDTO dto = promotionManagementService.getPromotionById(promotionId);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy thông tin khuyến mãi thành công",
                    dto));
        } catch (ResourceNotFoundException e) {
            logger.error("Promotion not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        } catch (Exception e) {
            logger.error("Error getting promotion", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        }
    }

    // Create promotion
    @PostMapping
    @PreAuthorize("hasAuthority('promotion.create')")
    public ResponseEntity<ApiResponse<PromotionDTO>> createPromotion(@Valid @RequestBody PromotionCreateRequest request) {
        try {
            PromotionDTO created = promotionManagementService.createPromotion(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Tạo khuyến mãi thành công",
                    created));
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate promotion", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        } catch (Exception e) {
            logger.error("Error creating promotion", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        }
    }

    // Update promotion
    @PutMapping("/{promotionId}")
    @PreAuthorize("hasAuthority('promotion.edit')")
    public ResponseEntity<ApiResponse<PromotionDTO>> updatePromotion(@PathVariable Integer promotionId,
                                                                     @Valid @RequestBody PromotionUpdateRequest request) {
        try {
            PromotionDTO updated = promotionManagementService.updatePromotion(promotionId, request);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Cập nhật khuyến mãi thành công",
                    updated));
        } catch (ResourceNotFoundException e) {
            logger.error("Promotion not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate promotion", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        } catch (Exception e) {
            logger.error("Error updating promotion", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        }
    }

    // Delete promotion
    @DeleteMapping("/{promotionId}")
    @PreAuthorize("hasAuthority('promotion.delete')")
    public ResponseEntity<ApiResponse<Void>> deletePromotion(@PathVariable Integer promotionId) {
        try {
            promotionManagementService.deletePromotion(promotionId);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Xoá khuyến mãi thành công",
                    null));
        } catch (ResourceNotFoundException e) {
            logger.error("Promotion not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        } catch (Exception e) {
            logger.error("Error deleting promotion", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null));
        }
    }

    // Get products in promotion
    @GetMapping("/{promotionId}/products")
    @PreAuthorize("hasAuthority('promotion.view')")
    public ResponseEntity<ApiResponse<java.util.List<ProductPromotionDTO>>> getPromotionProducts(@PathVariable Integer promotionId) {
        try {
            var list = promotionManagementService.getPromotionProducts(promotionId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Lấy sản phẩm khuyến mãi thành công", list));
        } catch (Exception e) {
            logger.error("Error get promotion products", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    // Add products to promotion
    @PostMapping("/{promotionId}/products")
    @PreAuthorize("hasAuthority('promotion.edit')")
    public ResponseEntity<ApiResponse<Void>> addProductsToPromotion(@PathVariable Integer promotionId, @RequestBody java.util.List<ProductPromotionCreateRequest> requests) {
        try {
            promotionManagementService.addProductsToPromotion(promotionId, requests);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Thêm sản phẩm vào khuyến mãi thành công", null));
        } catch (Exception e) {
            logger.error("Error adding products", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    // Remove product from promotion
    @DeleteMapping("/{promotionId}/products/{productId}")
    @PreAuthorize("hasAuthority('promotion.edit')")
    public ResponseEntity<ApiResponse<Void>> removeProductFromPromotion(@PathVariable Integer promotionId, @PathVariable Integer productId) {
        try {
            promotionManagementService.removeProductFromPromotion(promotionId, productId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Xoá sản phẩm khỏi khuyến mãi thành công", null));
        } catch (Exception e) {
            logger.error("Error removing product", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    // Inventory summary
    @GetMapping("/{promotionId}/inventory-summary")
    @PreAuthorize("hasAuthority('promotion.view')")
    public ResponseEntity<ApiResponse<PromotionInventorySummaryDTO>> getInventorySummary(@PathVariable Integer promotionId) {
        try {
            var summary = promotionManagementService.getInventorySummary(promotionId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Lấy thống kê kho khuyến mãi thành công", summary));
        } catch (Exception e) {
            logger.error("Error inventory summary", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    // Sales summary
    @GetMapping("/{promotionId}/sales-summary")
    @PreAuthorize("hasAuthority('promotion.view')")
    public ResponseEntity<ApiResponse<PromotionSalesSummaryDTO>> getSalesSummary(@PathVariable Integer promotionId,
                                                                                 @RequestParam(required = false) String startDate,
                                                                                 @RequestParam(required = false) String endDate) {
        try {
            var summary = promotionManagementService.getSalesSummary(promotionId, startDate, endDate);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Lấy thống kê bán hàng thành công", summary));
        } catch (Exception e) {
            logger.error("Error sales summary", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    // Usage
    @GetMapping("/{promotionId}/usage")
    @PreAuthorize("hasAuthority('promotion.view')")
    public ResponseEntity<ApiResponse<Long>> getUsage(@PathVariable Integer promotionId) {
        try {
            long usage = promotionManagementService.getUsage(promotionId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Lấy số lần sử dụng thành công", usage));
        } catch (Exception e) {
            logger.error("Error get usage", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 