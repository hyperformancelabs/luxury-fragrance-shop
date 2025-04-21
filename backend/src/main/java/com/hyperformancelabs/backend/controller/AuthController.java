package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Customer>> registerCustomer(@RequestBody RegisterRequest request) {
        try {
            Customer newCustomer = customerService.register(request);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            "Đăng ký thành công",
                            newCustomer
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> loginCustomer(@RequestBody LoginRequest request) {
        try {
            String token = customerService.loginAndGenerateToken(request);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            "Đăng nhập thành công",
                            token
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }
}

