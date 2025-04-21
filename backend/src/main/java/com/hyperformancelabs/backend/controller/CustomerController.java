package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;

import com.hyperformancelabs.backend.service.impl.CustomerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
//    @GetMapping("/me")
//    public ResponseEntity<ApiResponse<Customer>> getCustomerInfo() {

//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        Customer customer = customerService.getCustomerByUsername(username);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(
//                        ApiResponseStatus.SUCCESS_CODE,
//                        ApiResponseStatus.SUCCESS_STATUS,
//                        "Lấy thông tin thành công",
//                        customer
//                )
//        );
//    }
}
