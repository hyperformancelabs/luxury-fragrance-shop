package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.PaymentMethodDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.OrderManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Expose auxiliary data related to orders – payment methods & shipping providers –
 * at top-level /emp endpoints following REST best practices.
 */
@RestController
@RequestMapping("/emp")
public class PaymentAndShippingController {

    @Autowired
    private OrderManagementService orderManagementService;

    /**
     * List supported payment methods
     */
    @GetMapping("/payment-methods")
    @PreAuthorize("hasAuthority('paymentmethod.view')")
    public ResponseEntity<ApiResponse<List<PaymentMethodDTO>>> getPaymentMethods() {
        try {
            List<PaymentMethodDTO> methods = orderManagementService.getPaymentMethods();
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    methods
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(
                            ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    /**
     * List available shipping providers
     */
    @GetMapping("/shipping-providers")
    public ResponseEntity<ApiResponse<List<String>>> getShippingProviders() {
        List<String> providers = orderManagementService.getShippingProviders();
        return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                ApiResponseStatus.GET_SUCCESS_MESSAGE,
                providers
        ));
    }
} 