package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.WishlistDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emp/customers/{customerId}/wishlist")
public class WishlistManagementController {
    @Autowired
    private CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<List<WishlistDTO>>> getWishlist(@PathVariable Integer customerId) {
        try {
            var list = customerService.getWishlist(customerId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{wishlistId}")
    @PreAuthorize("hasAuthority('customer.edit')")
    public ResponseEntity<ApiResponse<Void>> deleteWishlist(@PathVariable Integer customerId, @PathVariable Integer wishlistId) {
        try {
            customerService.deleteWishlistItem(customerId, wishlistId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.DELETE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 