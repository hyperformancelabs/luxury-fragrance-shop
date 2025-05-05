package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CustomerResponseDTO;
import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.service.EmployeeService;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> registerCustomer(@Valid @RequestBody RegisterRequest request) {
        try {
            CustomerResponseDTO response = customerService.register(request);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            "Đăng ký thành công",
                            response
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
    public ResponseEntity<ApiResponse<String>> loginCustomer(@Valid @RequestBody LoginRequest request) {
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

    @PostMapping("/emp/register")
    public ResponseEntity<ApiResponse<String>> registerEmployee(
            @Valid @RequestBody EmployeeRegisterRequest request) {
        employeeService.registerEmployee(request);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        "Đăng ký nhân viên thành công",
                        null
                )
        );
    }
}
