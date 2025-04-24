package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.service.CartService;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private CustomerService customerService;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Cart>> getCartsByCustomer(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        List<Cart> carts = cartService.getCartsByCustomer(customer);
        return ResponseEntity.ok(carts);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<Cart> getCartBySessionId(@PathVariable String sessionId) {
        return cartService.getCartBySessionId(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
