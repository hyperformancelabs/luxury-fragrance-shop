package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.AddToCartRequest;
import com.hyperformancelabs.backend.dto.CartDTO;
import com.hyperformancelabs.backend.dto.CartItemDTO;
import com.hyperformancelabs.backend.dto.UpdateCartItemRequest;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.CartItem;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private static final String CART_STATUS_ACTIVE = "active";
    private static final String CART_STATUS_ABANDONED = "abandoned";
    private static final String CART_STATUS_CONVERTED = "converted";

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Get cart for authenticated user
     */
    public CartDTO getCartForCustomer(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        Cart cart = cartRepository.findByCustomerAndStatus(customer, CART_STATUS_ACTIVE)
                .orElseGet(() -> createNewCart(customer, null));

        return mapCartToDTO(cart);
    }

    /**
     * Get cart for guest user by session ID
     */
    public CartDTO getCartForGuest(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            throw new IllegalArgumentException("Session ID cannot be empty");
        }

        Cart cart = cartRepository.findBySessionIdAndStatus(sessionId, CART_STATUS_ACTIVE)
                .orElseGet(() -> createNewCart(null, sessionId));

        return mapCartToDTO(cart);
    }

    /**
     * Add item to cart for authenticated user
     */
    @Transactional
    public CartDTO addItemToCustomerCart(Integer customerId, AddToCartRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        Cart cart = cartRepository.findByCustomerAndStatus(customer, CART_STATUS_ACTIVE)
                .orElseGet(() -> createNewCart(customer, null));

        return addItemToCart(cart, request);
    }

    /**
     * Add item to cart for guest user
     */
    @Transactional
    public CartDTO addItemToGuestCart(String sessionId, AddToCartRequest request) {
        if (sessionId == null || sessionId.isEmpty()) {
            throw new IllegalArgumentException("Session ID cannot be empty");
        }

        Cart cart = cartRepository.findBySessionIdAndStatus(sessionId, CART_STATUS_ACTIVE)
                .orElseGet(() -> createNewCart(null, sessionId));

        return addItemToCart(cart, request);
    }

    /**
     * Update cart item
     */
    @Transactional
    public CartDTO updateCartItem(UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(request.getCartItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + request.getCartItemId()));

        Cart cart = cartItem.getCart();

        // Update quantity if provided
        if (request.getQuantity() != null) {
            if (request.getQuantity() <= 0) {
                // Remove item if quantity is zero or negative
                cartItemRepository.delete(cartItem);
            } else {
                cartItem.setQuantity(request.getQuantity());
                cartItemRepository.save(cartItem);
            }
        }

        // Update selection status if provided
        if (request.getIsSelected() != null) {
            cartItem.setIsSelected(request.getIsSelected());
            cartItemRepository.save(cartItem);
        }

        // Update note if provided
        if (request.getNote() != null) {
            cartItem.setNote(request.getNote());
            cartItemRepository.save(cartItem);
        }

        // Recalculate cart total
        updateCartTotal(cart);

        return mapCartToDTO(cart);
    }

    /**
     * Remove item from cart
     */
    @Transactional
    public CartDTO removeCartItem(Integer cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        Cart cart = cartItem.getCart();
        cartItemRepository.delete(cartItem);

        // Recalculate cart total
        updateCartTotal(cart);

        return mapCartToDTO(cart);
    }

    /**
     * Clear cart
     */
    @Transactional
    public void clearCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

        cartItemRepository.deleteByCart(cart);
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    /**
     * Merge guest cart with customer cart when user logs in
     */
    @Transactional
    public CartDTO mergeGuestCartWithCustomerCart(String sessionId, Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        // Find guest cart
        Optional<Cart> guestCartOpt = cartRepository.findBySessionIdAndStatus(sessionId, CART_STATUS_ACTIVE);
        if (guestCartOpt.isEmpty()) {
            // No guest cart to merge, just return customer cart or create new one
            Cart customerCart = cartRepository.findByCustomerAndStatus(customer, CART_STATUS_ACTIVE)
                    .orElseGet(() -> createNewCart(customer, null));
            return mapCartToDTO(customerCart);
        }

        Cart guestCart = guestCartOpt.get();

        // Find or create customer cart
        Cart customerCart = cartRepository.findByCustomerAndStatus(customer, CART_STATUS_ACTIVE)
                .orElseGet(() -> createNewCart(customer, null));

        // Get all items from guest cart
        List<CartItem> guestItems = cartItemRepository.findByCart(guestCart);

        // Merge items from guest cart to customer cart
        for (CartItem guestItem : guestItems) {
            Product product = guestItem.getProduct();
            Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(customerCart, product);

            if (existingItemOpt.isPresent()) {
                // Update quantity of existing item
                CartItem existingItem = existingItemOpt.get();
                existingItem.setQuantity(existingItem.getQuantity() + guestItem.getQuantity());
                existingItem.setIsSelected(true); // Ensure item is selected
                cartItemRepository.save(existingItem);
            } else {
                // Create new item in customer cart
                CartItem newItem = new CartItem();
                newItem.setCart(customerCart);
                newItem.setProduct(product);
                newItem.setQuantity(guestItem.getQuantity());
                newItem.setUnitPrice(guestItem.getUnitPrice());
                newItem.setNote(guestItem.getNote());
                newItem.setIsSelected(true);
                cartItemRepository.save(newItem);
            }
        }

        // Update customer cart total
        updateCartTotal(customerCart);

        // Mark guest cart as abandoned
        guestCart.setStatus(CART_STATUS_ABANDONED);
        cartRepository.save(guestCart);

        return mapCartToDTO(customerCart);
    }

    /**
     * Helper method to create a new cart
     */
    private Cart createNewCart(Customer customer, String sessionId) {
        Cart cart = new Cart();
        cart.setCustomer(customer);
        cart.setSessionId(sessionId);
        cart.setStatus(CART_STATUS_ACTIVE);
        cart.setTotalAmount(BigDecimal.ZERO);
        return cartRepository.save(cart);
    }

    /**
     * Helper method to add item to cart
     */
    private CartDTO addItemToCart(Cart cart, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Check if product already exists in cart
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItemOpt.isPresent()) {
            // Update quantity of existing item
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setIsSelected(true); // Ensure item is selected
            if (request.getNote() != null) {
                existingItem.setNote(request.getNote());
            }
            cartItemRepository.save(existingItem);
        } else {
            // Add new item to cart
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.setUnitPrice(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice());
            newItem.setNote(request.getNote());
            newItem.setIsSelected(true);
            cartItemRepository.save(newItem);
        }

        // Update cart total
        updateCartTotal(cart);

        return mapCartToDTO(cart);
    }

    /**
     * Helper method to update cart total
     */
    private void updateCartTotal(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart(cart);
        BigDecimal total = items.stream()
                .filter(CartItem::getIsSelected)
                .map(item -> {
                    BigDecimal price = item.getUnitPrice();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);
        cartRepository.save(cart);
    }

    /**
     * Helper method to map Cart to CartDTO
     */
    private CartDTO mapCartToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getCartId());
        dto.setStatus(cart.getStatus());
        dto.setTotalAmount(cart.getTotalAmount());
        dto.setSessionId(cart.getSessionId());

        if (cart.getCustomer() != null) {
            dto.setCustomerId(cart.getCustomer().getCustomerId());
            dto.setCustomerName(cart.getCustomer().getName());
        }

        List<CartItem> items = cartItemRepository.findByCart(cart);
        List<CartItemDTO> itemDTOs = items.stream()
                .map(this::mapCartItemToDTO)
                .collect(Collectors.toList());

        dto.setItems(itemDTOs);
        dto.setItemCount(itemDTOs.size());

        return dto;
    }

    /**
     * Helper method to map CartItem to CartItemDTO
     */
    private CartItemDTO mapCartItemToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemId(item.getCartItemId());
        dto.setProductId(item.getProduct().getProductId());
        dto.setProductName(item.getProduct().getProductName());
        dto.setProductImage(item.getProduct().getImageUrl());
        dto.setVolume(item.getProduct().getVolume());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        dto.setNote(item.getNote());
        dto.setIsSelected(item.getIsSelected());
        return dto;
    }
}
