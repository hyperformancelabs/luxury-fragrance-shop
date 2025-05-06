package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.AddToWishListRequest;
import com.hyperformancelabs.backend.dto.WishListItemResponse;
import com.hyperformancelabs.backend.exception.NotFoundException;
import com.hyperformancelabs.backend.model.*;
import com.hyperformancelabs.backend.repository.*;
import com.hyperformancelabs.backend.service.WishListService;
import com.hyperformancelabs.backend.util.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishListServiceImpl implements WishListService {

    @Autowired
    private WishListRepository wishlistRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public List<WishListItemResponse> getAllWishlist(String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        List<WishList> wishlists = wishlistRepository.findByCustomer(customer);

        return wishlists.stream()
                .filter(w -> w.getProductVariant() != null)
                .map(w -> {
                    var variant = w.getProductVariant();
                    var product = variant.getProduct();
                    var brand = product.getBrand();

                    return new WishListItemResponse(
                            w.getWishlistId(),
                            variant.getProductVariantId(),
                            product.getProductName(),
                            variant.getVolume(),
                            variant.getPrice(),
                            brand != null ? brand.getBrandName() : null,
                            product.getImageUrl(),
                            brand != null ? brand.getCountryOfOrigin() : null
                    );
                }).collect(Collectors.toList());
    }

    @Override
    public void addToWishlist(Customer customer, AddToWishListRequest request) {
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new IllegalArgumentException("Product variant not found"));

        boolean exists = wishlistRepository.existsByCustomerAndProductVariant(customer, variant);
        if (exists) {
            return;
        }

        WishList wishlist = new WishList();
        wishlist.setCustomer(customer);
        wishlist.setProductVariant(variant);
        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void moveAllToCart(String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        List<WishList> wishlists = wishlistRepository.findByCustomer(customer);

        if (wishlists.isEmpty()) return;

        Cart cart = cartRepository.findByCustomerAndStatus(customer, "active")
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setStatus("active");
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        for (WishList wish : wishlists) {
            ProductVariant variant = wish.getProductVariant();
            if (variant == null) continue;

            Optional<CartItem> existing = cartItemRepository.findByCartAndProductVariant(cart, variant);
            if (existing.isPresent()) {
                CartItem cartItem = existing.get();
                cartItem.setQuantity(cartItem.getQuantity() + 1); // tăng số lượng
                cartItemRepository.save(cartItem);
            } else {
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProductVariant(variant);
                cartItem.setQuantity(1); // default
                cartItem.setUnitPrice(variant.getPrice());
                cartItem.setIsSelected(true);
                cartItemRepository.save(cartItem);
            }
        }

        BigDecimal total = cartItemRepository.findAllByCart(cart).stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
        cartRepository.save(cart);


        wishlistRepository.deleteAll(wishlists);
    }


}
