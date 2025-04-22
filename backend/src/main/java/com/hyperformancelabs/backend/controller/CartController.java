package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.AddToCartRequest;
import com.hyperformancelabs.backend.dto.CartDTO;
import com.hyperformancelabs.backend.dto.UpdateCartItemRequest;
import com.hyperformancelabs.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * Get cart for authenticated user
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CartDTO> getCustomerCart(@PathVariable Integer customerId) {
        CartDTO cart = cartService.getCartForCustomer(customerId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Get cart for guest user
     */
    @GetMapping("/guest/{sessionId}")
    public ResponseEntity<CartDTO> getGuestCart(@PathVariable String sessionId) {
        CartDTO cart = cartService.getCartForGuest(sessionId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Add item to cart for authenticated user
     */
    @PostMapping("/customer/{customerId}/items")
    public ResponseEntity<CartDTO> addItemToCustomerCart(
            @PathVariable Integer customerId,
            @Valid @RequestBody AddToCartRequest request) {
        CartDTO cart = cartService.addItemToCustomerCart(customerId, request);
        return ResponseEntity.ok(cart);
    }

    /**
     * Add item to cart for guest user
     */
    @PostMapping("/guest/{sessionId}/items")
    public ResponseEntity<CartDTO> addItemToGuestCart(
            @PathVariable String sessionId,
            @Valid @RequestBody AddToCartRequest request) {
        CartDTO cart = cartService.addItemToGuestCart(sessionId, request);
        return ResponseEntity.ok(cart);
    }

    /**
     * Update cart item
     */
    @PutMapping("/items")
    public ResponseEntity<CartDTO> updateCartItem(@Valid @RequestBody UpdateCartItemRequest request) {
        CartDTO cart = cartService.updateCartItem(request);
        return ResponseEntity.ok(cart);
    }

    /**
     * Remove item from cart
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartDTO> removeCartItem(@PathVariable Integer cartItemId) {
        CartDTO cart = cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Clear cart
     */
    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> clearCart(@PathVariable Integer cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Merge guest cart with customer cart when user logs in
     */
    @PostMapping("/merge")
    public ResponseEntity<CartDTO> mergeGuestCartWithCustomerCart(
            @RequestParam String sessionId,
            @RequestParam Integer customerId) {
        CartDTO cart = cartService.mergeGuestCartWithCustomerCart(sessionId, customerId);
        return ResponseEntity.ok(cart);
    }
}
