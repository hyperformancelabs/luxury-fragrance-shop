package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.OrderListResponse;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.OrderManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/emp/orders")
public class OrderManagementController {

    @Autowired
    private OrderManagementService orderManagementService;

    /**
     * Get all orders with pagination, sorting and optional filters
     */
    @GetMapping
    @PreAuthorize("hasAuthority('order.view')")
    public ResponseEntity<ApiResponse<OrderListResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String dateFrom,  // dd/MM/yyyy
            @RequestParam(required = false) String dateTo,    // dd/MM/yyyy
            @RequestParam(required = false) String keyword
    ) {
        try {
            Map<String, String> filters = new HashMap<>();
            if (status != null) filters.put("status", status);
            if (customerId != null) filters.put("customerId", customerId.toString());
            if (dateFrom != null) filters.put("dateFrom", dateFrom);
            if (dateTo != null) filters.put("dateTo", dateTo);
            if (keyword != null) filters.put("keyword", keyword);

            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            OrderListResponse response = orderManagementService.getAllOrders(page, size, sortBy, direction, filters);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    /**
     * Get order detail
     */
    @GetMapping("/{orderId}")
    @PreAuthorize("hasAuthority('order.view')")
    public ResponseEntity<ApiResponse<com.hyperformancelabs.backend.dto.OrderDetailDTO>> getOrderDetail(@PathVariable Integer orderId) {
        try {
            var detail = orderManagementService.getOrderDetail(orderId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, (e.getClass().getSimpleName() + ": " + (e.getMessage()==null?"":e.getMessage())), null));
        }
    }

    /**
     * Create manual order
     */
    @PostMapping
    @PreAuthorize("hasAuthority('order.create')")
    public ResponseEntity<ApiResponse<Integer>> createOrder(@RequestBody @jakarta.validation.Valid com.hyperformancelabs.backend.dto.AdminCreateOrderRequest request) {
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            Integer id = orderManagementService.createOrder(request, username);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.CREATE_SUCCESS_MESSAGE, id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /**
     * Update general info
     */
    @PutMapping("/{orderId}")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> updateGeneralInfo(@PathVariable Integer orderId, @RequestBody @jakarta.validation.Valid com.hyperformancelabs.backend.dto.UpdateOrderRequest request) {
        try {
            orderManagementService.updateOrderGeneralInfo(orderId, request);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /** Update order status */
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> updateStatus(@PathVariable Integer orderId, @RequestParam String status) {
        try {
            orderManagementService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /** Cancel order (soft delete) */
    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasAuthority('order.delete')")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Integer orderId, @RequestParam(required = false) String reason) {
        try {
            orderManagementService.cancelOrder(orderId, reason);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.DELETE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /* ---------------- Order Items ---------------- */
    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Integer>> addItem(@PathVariable Integer orderId, @RequestBody @jakarta.validation.Valid com.hyperformancelabs.backend.dto.OrderItemRequest request) {
        try {
            Integer id = orderManagementService.addOrderItem(orderId, request);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.CREATE_SUCCESS_MESSAGE, id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @PutMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> updateItemQuantity(@PathVariable Integer orderId, @PathVariable Integer itemId, @RequestParam Integer quantity) {
        try {
            orderManagementService.updateOrderItemQuantity(orderId, itemId, quantity);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Integer orderId, @PathVariable Integer itemId) {
        try {
            orderManagementService.deleteOrderItem(orderId, itemId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.DELETE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /* -------------- Shipment & Payment ---------------- */
    @PutMapping("/{orderId}/shipment")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> updateShipment(@PathVariable Integer orderId, @RequestBody com.hyperformancelabs.backend.dto.UpdateShipmentRequest request) {
        try {
            orderManagementService.updateShipment(orderId, request);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @PutMapping("/{orderId}/payment")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> updatePayment(@PathVariable Integer orderId, @RequestBody com.hyperformancelabs.backend.dto.UpdatePaymentRequest request) {
        try {
            orderManagementService.updatePayment(orderId, request);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /* -------------- Promotions ---------------- */
    @PostMapping("/{orderId}/promotions")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> applyPromotion(@PathVariable Integer orderId, @RequestParam Integer promotionId) {
        try {
            orderManagementService.applyPromotion(orderId, promotionId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{orderId}/promotions/{promotionId}")
    @PreAuthorize("hasAuthority('order.edit')")
    public ResponseEntity<ApiResponse<Void>> removePromotion(@PathVariable Integer orderId, @PathVariable Integer promotionId) {
        try {
            orderManagementService.removePromotion(orderId, promotionId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.DELETE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 