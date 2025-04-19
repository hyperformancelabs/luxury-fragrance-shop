package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.exception.ApiResponse;
import com.hyperformancelabs.backend.models.Customer;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        ApiResponseStatus.GET_SUCCESS_MESSAGE,
                        customers
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable Integer id) {
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        ApiResponseStatus.GET_SUCCESS_MESSAGE,
                        customer
                )
        );
    }

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
    public ResponseEntity<ApiResponse<Customer>> loginCustomer(@RequestBody LoginRequest request) {
        try {
            Customer customer = customerService.login(request);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            "Đăng nhập thành công",
                            customer
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
