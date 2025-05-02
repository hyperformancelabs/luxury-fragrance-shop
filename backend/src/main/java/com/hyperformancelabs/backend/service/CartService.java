package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;

import java.util.List;

public interface CartService {
    void addProductToCart(Customer customer, AddToCartRequest request);
    List<CartItemResponse> getCartItemsForCustomer(Customer customer);

//    List<CartItemDTO> getCartItemsForCustomer(String username);
void updateCartItemQuantity(Customer customer, UpdateCartItemRequest request);
    void removeItemFromCart(String username, Integer productVariantId);
    void clearCart(String username);

    void addProductToCartBySession(String sessionId, Integer productVariantId, Integer quantity);

    List<CartItemDTO> getCartItemsBySession(String sessionId);

    void updateCartItemQuantityBySession(String sessionId, Integer productVariantId, Integer quantity);

    void removeItemFromCartBySession(String sessionId, Integer productVariantId);

    void clearCartBySession(String sessionId);

//    Cart getOrCreateCartBySession(String sessionId);
void mergeSessionCartToCustomer(String sessionId, String username);

    void syncCartItems(Customer customer, SyncCartRequest request);

}
