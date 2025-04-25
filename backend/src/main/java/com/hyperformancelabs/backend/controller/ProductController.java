package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        ApiResponseStatus.GET_SUCCESS_MESSAGE,
                        products
                )
        );
    }
}
