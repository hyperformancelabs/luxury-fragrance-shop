package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.AddToWishListRequest;
import com.hyperformancelabs.backend.dto.WishListItemResponse;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.service.WishListService;
import com.hyperformancelabs.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishListController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private WishListService wishListService;

    @GetMapping
    public List<WishListItemResponse> getWishlist(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // bỏ "Bearer "
        return wishListService.getAllWishlist(token);
    }



    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody AddToWishListRequest request,
                                           @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        wishListService.addToWishlist(customer, request);
        return ResponseEntity.ok("Added to wishlist");
    }

    @PostMapping("/move-to-cart")
    public ResponseEntity<?> moveToCart(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        wishListService.moveAllToCart(token);
        return ResponseEntity.ok("Moved all items from wishlist to cart");
    }


}