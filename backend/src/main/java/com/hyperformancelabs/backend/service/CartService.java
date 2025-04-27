package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CartItemDTO;
import com.hyperformancelabs.backend.dto.CartItemResponse;
import com.hyperformancelabs.backend.model.Cart;

import java.util.List;

public interface CartService {
    void addProductToCart(String username, Integer productId, Integer quantity);
    List<CartItemDTO> getCartItemsForCustomer(String username);
    void updateCartItemQuantity(String username, Integer productId, Integer quantity);
    void removeItemFromCart(String username, Integer productId);
    void clearCart(String username);

    void addProductToCartBySession(String sessionId, Integer productId, Integer quantity);

    List<CartItemDTO> getCartItemsBySession(String sessionId);

    void updateCartItemQuantityBySession(String sessionId, Integer productId, Integer quantity);

    void removeItemFromCartBySession(String sessionId, Integer productId);

    void clearCartBySession(String sessionId);

//    Cart getOrCreateCartBySession(String sessionId);
void mergeSessionCartToCustomer(String sessionId, String username);

}
