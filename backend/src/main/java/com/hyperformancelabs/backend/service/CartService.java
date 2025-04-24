package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;

import java.util.List;
import java.util.Optional;

public interface CartService {
    List<Cart> getCartsByCustomer(Customer customer);

    Optional<Cart> getCartBySessionId(String sessionId);
}
