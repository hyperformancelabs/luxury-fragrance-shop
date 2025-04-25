package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.CartItemDTO;
import com.hyperformancelabs.backend.dto.CartItemResponse;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.CartItem;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.ProductRepository;
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
    private ProductRepository productRepository;

    @Override
    public void addProductToCart(String username, Integer productId, Integer quantity) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository
                .findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setStatus("active");
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));


        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getPrice());
            cartItem.setIsSelected(true);
        }

        cartItemRepository.save(cartItem);


        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        BigDecimal newTotal = cartItems.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(newTotal);

        cartRepository.save(cart);
    }


    @Override
    public List<CartItemDTO> getCartItemsForCustomer(String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository
                .findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        return cartItems.stream()
                .map(item -> {
                    Product product = item.getProduct();
                    return new CartItemDTO(
                            product.getProductId(),
                            product.getProductName(),
                            product.getBrand().getBrandName(),
                            product.getVolume(),
                            item.getUnitPrice(),
                            item.getQuantity(),
                            item.getIsSelected()
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public void updateCartItemQuantity(String username, Integer productId, Integer quantity) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository
                .findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        BigDecimal newTotal = cartItems.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(newTotal);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void removeItemFromCart(String username, Integer productId) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        cartItemRepository.delete(cartItem); // chỉ xóa trong DB


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
    public void addProductToCartBySession(String sessionId, Integer productId, Integer quantity) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setSessionId(sessionId);
                    newCart.setStatus("active"); // nếu cần, hoặc bỏ luôn
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product).orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getPrice());
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
                    Product product = item.getProduct();
                    return new CartItemDTO(
                            product.getProductId(),
                            product.getProductName(),
                            product.getBrand().getBrandName(),
                            product.getVolume(),
                            item.getUnitPrice(),
                            item.getQuantity(),
                            item.getIsSelected()
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public void updateCartItemQuantityBySession(String sessionId, Integer productId, Integer quantity) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        updateCartTotal(cart);
    }

    @Override
    public void removeItemFromCartBySession(String sessionId, Integer productId) {
        Cart cart = cartRepository.findTopBySessionIdOrderByCartIdDesc(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
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

        // Tìm hoặc tạo giỏ hàng của Customer
        Cart customerCart = cartRepository.findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setStatus("active");
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        // Gộp từng sản phẩm
        for (CartItem sessionItem : sessionItems) {
            Product product = sessionItem.getProduct();
            Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(customerCart, product);

            if (existingItemOpt.isPresent()) {
                CartItem existingItem = existingItemOpt.get();
                existingItem.setQuantity(existingItem.getQuantity() + sessionItem.getQuantity());
                cartItemRepository.save(existingItem);
            } else {
                CartItem newItem = new CartItem();
                newItem.setCart(customerCart);
                newItem.setProduct(product);
                newItem.setQuantity(sessionItem.getQuantity());
                newItem.setUnitPrice(sessionItem.getUnitPrice());
                newItem.setIsSelected(sessionItem.getIsSelected());
                cartItemRepository.save(newItem);
            }
        }

        // Xoá giỏ theo sessionId (tuỳ chọn)
        cartItemRepository.deleteAll(sessionItems);
        cartRepository.delete(sessionCart);

        // Cập nhật tổng tiền
        updateCartTotal(customerCart);
    }


}