package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.GetCartItemRequest;
import com.hyperformancelabs.backend.model.CartItem;

import java.util.List;

public interface CartService {
    List<GetCartItemRequest> getAllProductFromCart(Integer customerId);
}
