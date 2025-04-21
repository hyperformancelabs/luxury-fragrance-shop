package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.GetCartItemRequest;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CartService;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse<List<GetCartItemRequest>>> getAllProductFromCart(@PathVariable Integer customerId) {
        List<GetCartItemRequest> items = cartService.getAllProductFromCart(customerId);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        ApiResponseStatus.GET_SUCCESS_MESSAGE,
                        items
                )
        );
    }

}
