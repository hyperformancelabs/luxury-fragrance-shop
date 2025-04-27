package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CartItemDTO;
import com.hyperformancelabs.backend.dto.CartItemResponse;
import com.hyperformancelabs.backend.model.Cart;

import java.util.List;

public interface CartService {
    void addProductToCart(String username, Integer productVariantId, Integer quantity);
    List<CartItemDTO> getCartItemsForCustomer(String username);
    void updateCartItemQuantity(String username, Integer productVariantId, Integer quantity);
    void removeItemFromCart(String username, Integer productVariantId);
    void clearCart(String username);

    void addProductToCartBySession(String sessionId, Integer productVariantId, Integer quantity);

    List<CartItemDTO> getCartItemsBySession(String sessionId);

    void updateCartItemQuantityBySession(String sessionId, Integer productVariantId, Integer quantity);

    void removeItemFromCartBySession(String sessionId, Integer productVariantId);

    void clearCartBySession(String sessionId);

//    Cart getOrCreateCartBySession(String sessionId);
void mergeSessionCartToCustomer(String sessionId, String username);

}
