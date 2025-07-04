package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emp/customers/{customerId}/payment-methods")
public class CustomerPaymentMethodManagementController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerPaymentMethodManagementController.class);

    @Autowired
    private CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasAuthority('customer.payment.view')")
    public ResponseEntity<ApiResponse<List<CustomerPaymentMethodDTO>>> getPaymentMethods(@PathVariable Integer customerId) {
        try {
            List<CustomerPaymentMethodDTO> list = customerService.getPaymentMethods(customerId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, list));
        } catch (Exception e) {
            logger.error("Error", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public ResponseEntity<ApiResponse<CustomerPaymentMethodDTO>> addPaymentMethod(@PathVariable Integer customerId, @Valid @RequestBody CustomerPaymentMethodCreateRequest request) {
        try {
            CustomerPaymentMethodDTO dto = customerService.addPaymentMethod(customerId, request);
            return ResponseEntity.status(201).body(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.CREATE_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            logger.error("Error", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @PutMapping("/{cpmId}")
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public ResponseEntity<ApiResponse<CustomerPaymentMethodDTO>> updatePaymentMethod(@PathVariable Integer customerId, @PathVariable Integer cpmId, @Valid @RequestBody CustomerPaymentMethodUpdateRequest request) {
        try {
            CustomerPaymentMethodDTO dto = customerService.updatePaymentMethod(customerId, cpmId, request);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @PatchMapping("/{cpmId}/default")
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public ResponseEntity<ApiResponse<Void>> setDefault(@PathVariable Integer customerId, @PathVariable Integer cpmId) {
        try {
            customerService.setDefaultPaymentMethod(customerId, cpmId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{cpmId}")
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public ResponseEntity<ApiResponse<Void>> deletePaymentMethod(@PathVariable Integer customerId, @PathVariable Integer cpmId) {
        try {
            customerService.deletePaymentMethod(customerId, cpmId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.DELETE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 