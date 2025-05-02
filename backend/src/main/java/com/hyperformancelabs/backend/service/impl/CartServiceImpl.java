package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.*;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.CartService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;


    @Override
    @Transactional
    public void addProductToCart(Customer customer, AddToCartRequest request) {
        ProductVariant productVariant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new IllegalArgumentException("Product variant not found"));

        Cart cart = cartRepository.findByCustomerAndStatus(customer, "active")
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setStatus("active");
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });


        Optional<CartItem> optionalCartItem =
                cartItemRepository.findByCartAndProductVariant(cart, productVariant);

        CartItem cartItem;

        if (optionalCartItem.isPresent()) {
            cartItem = optionalCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            if (request.getNote() != null) {
                cartItem.setNote(request.getNote());
            }
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProductVariant(productVariant);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setUnitPrice(productVariant.getPrice());
            cartItem.setNote(request.getNote());
            cartItem.setIsSelected(true);
        }

        cartItemRepository.save(cartItem);

        BigDecimal total = cartItemRepository.findAllByCart(cart).stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);
        cartRepository.save(cart);
    }




    @Override
    public List<CartItemResponse> getCartItemsForCustomer(Customer customer) {
        Cart cart = cartRepository.findByCustomerAndStatus(customer, "active")
                .orElse(null);

        if (cart == null) return List.of();

        List<CartItem> items = cartItemRepository.findAllByCart(cart);

        return items.stream().map(item -> {
            ProductVariant variant = item.getProductVariant();
            Product product = variant.getProduct();
            Brand brand = product.getBrand();

            CartItemResponse response = new CartItemResponse();
            response.setCartItemId(item.getCartItemId());
            response.setProductVariantId(variant.getProductVariantId());
            response.setProductName(product.getProductName());
            response.setVolume(variant.getVolume());
            response.setUnitPrice(item.getUnitPrice());
            response.setQuantity(item.getQuantity());
            response.setNote(item.getNote());

            response.setBrandName(brand.getBrandName());
            response.setCountryOfOrigin(brand.getCountryOfOrigin());
            response.setImageUrl(product.getImageUrl());

            return response;
        }).toList();
    }


    @Override
    @Transactional
    public void updateCartItemQuantity(Customer customer, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByCustomerAndStatus(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItem item = cartItemRepository.findByCartAndProductVariant(cart, variant)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (request.getNewQuantity() > 0) {
            item.setQuantity(request.getNewQuantity());
            cartItemRepository.save(item);
        } else {
            cartItemRepository.delete(item);
        }


        BigDecimal total = cartItemRepository.findAllByCart(cart).stream()
                .map(ci -> ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);
        cartRepository.save(cart);
    }


    @Override
    @Transactional
    public void removeItemFromCart(String username, Integer productVariantId) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProductVariant(cart, productVariant)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        cartItemRepository.delete(cartItem);


        List<CartItem> remainingItems = cartItemRepository.findByCart(cart);
        BigDecimal newTotal = remainingItems.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(newTotal);

        cartRepository.save(cart);
    }

    public void clearCart(String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        cartItemRepository.deleteAll(cartItems);

        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }



    @Override
    public void addProductToCartBySession(String sessionId, Integer productVariantId, Integer quantity) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setSessionId(sessionId);
                    newCart.setStatus("active");
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProductVariant(cart, productVariant).orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProductVariant(productVariant);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(productVariant.getPrice());
            cartItem.setIsSelected(true);
        }

        cartItemRepository.save(cartItem);


        updateCartTotal(cart);
    }


    @Override
    public List<CartItemDTO> getCartItemsBySession(String sessionId) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return cartItemRepository.findByCart(cart).stream()
                .map(item -> {
                    ProductVariant variant = item.getProductVariant();
                    return new CartItemDTO(
                            variant.getProductVariantId(),
                            variant.getProduct().getProductName(),
                            variant.getProduct().getBrand().getBrandName(),
                            variant.getVolume(),
                            item.getUnitPrice(),
                            item.getQuantity(),
                            item.getIsSelected()
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public void updateCartItemQuantityBySession(String sessionId, Integer productVariantId, Integer quantity) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProductVariant(cart, productVariant)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        updateCartTotal(cart);
    }

    @Override
    public void removeItemFromCartBySession(String sessionId, Integer productVariantId) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProductVariant(cart, productVariant)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        cartItemRepository.delete(cartItem);
        updateCartTotal(cart);
    }

    @Override
    public void clearCartBySession(String sessionId) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findByCart(cart);
        cartItemRepository.deleteAll(items);

        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }



    private Cart getOrCreateCartBySession(String sessionId) {
        return cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setSessionId(sessionId);
                    newCart.setStatus("session"); // Tuỳ bạn có dùng không
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });
    }

    private void updateCartTotal(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        BigDecimal newTotal = cartItems.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(newTotal);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void mergeSessionCartToCustomer(String sessionId, String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Cart> sessionCartOpt = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId);
        if (sessionCartOpt.isEmpty()) return;

        Cart sessionCart = sessionCartOpt.get();
        List<CartItem> sessionItems = cartItemRepository.findByCart(sessionCart);


        Cart customerCart = cartRepository.findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setStatus("active");
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });


        for (CartItem sessionItem : sessionItems) {
            ProductVariant productVariant = sessionItem.getProductVariant();
            Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProductVariant(customerCart, productVariant);

            if (existingItemOpt.isPresent()) {
                CartItem existingItem = existingItemOpt.get();
                existingItem.setQuantity(existingItem.getQuantity() + sessionItem.getQuantity());
                cartItemRepository.save(existingItem);
            } else {
                CartItem newItem = new CartItem();
                newItem.setCart(customerCart);
                newItem.setProductVariant(productVariant);
                newItem.setQuantity(sessionItem.getQuantity());
                newItem.setUnitPrice(sessionItem.getUnitPrice());
                newItem.setIsSelected(sessionItem.getIsSelected());
                cartItemRepository.save(newItem);
            }
        }


        cartItemRepository.deleteAll(sessionItems);
        cartRepository.delete(sessionCart);


        updateCartTotal(customerCart);
    }


    @Override
    @Transactional
    public void syncCartItems(Customer customer, SyncCartRequest request) {
        Cart cart = cartRepository.findByCustomerAndStatus(customer, "active")
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setStatus("active");
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        for (SyncCartRequest.CartItemData itemData : request.getCartItems()) {
            ProductVariant variant = productVariantRepository.findById(itemData.getProductVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));

            Optional<CartItem> existingItemOpt =
                    cartItemRepository.findByCartAndProductVariant(cart, variant);

            if (existingItemOpt.isPresent()) {
                CartItem existing = existingItemOpt.get();
                existing.setQuantity(existing.getQuantity() + itemData.getQuantity());
                if (itemData.getNote() != null) {
                    existing.setNote(itemData.getNote());
                }
                cartItemRepository.save(existing);
            } else {
                CartItem newItem = new CartItem();
                newItem.setCart(cart);
                newItem.setProductVariant(variant);
                newItem.setQuantity(itemData.getQuantity());
                newItem.setUnitPrice(variant.getPrice());
                newItem.setNote(itemData.getNote());

                cartItemRepository.save(newItem);
            }
        }

        BigDecimal total = cartItemRepository.findAllByCart(cart).stream()
                .map(ci -> ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);
        cartRepository.save(cart);
    }

}