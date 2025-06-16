package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CartDTO;
import com.hyperformancelabs.backend.dto.CartListResponse;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emp/customers/{customerId}/carts")
public class CartManagementController {

    @Autowired
    private CustomerService customerService;

    /** List carts of customer */
    @GetMapping
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<CartListResponse>> getCarts(@PathVariable Integer customerId,
                                                                  @RequestParam(required = false) String status,
                                                                  @RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "10") int size) {
        try {
            CartListResponse resp = customerService.getCarts(customerId, status, page, size);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, resp));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /** Cart detail */
    @GetMapping("/{cartId}")
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<CartDTO>> getCart(@PathVariable Integer customerId,@PathVariable Integer cartId) {
        try {
            CartDTO dto = customerService.getCartDetail(customerId, cartId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 