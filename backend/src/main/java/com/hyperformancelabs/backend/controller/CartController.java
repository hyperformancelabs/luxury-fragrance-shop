package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.CartItem;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.service.CartService;
import com.hyperformancelabs.backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

import static com.hyperformancelabs.backend.exception.ErrorMessage.*;

@RestController
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(CUSTOMER_NOT_FOUND));

        try {
            cartService.addProductToCart(customer, request);
            return ResponseEntity.ok("Product added to cart successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add to cart: " + e.getMessage());
        }


    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(CUSTOMER_NOT_FOUND));

        List<CartItemResponse> cartItems = cartService.getCartItemsForCustomer(customer);
        return ResponseEntity.ok(cartItems);
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateCartItemQuantity(@RequestBody @Valid UpdateCartItemRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(CUSTOMER_NOT_FOUND));

        cartService.updateCartItemQuantity(customer, request);
        return ResponseEntity.ok("Cart item updated.");
    }


    @DeleteMapping("/remove-item/{productVariantId}")
    public ResponseEntity<ApiResponse<String>> removeItem(
            @PathVariable Integer productVariantId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            cartService.removeItemFromCart(username, productVariantId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.DELETE_SUCCESS_MESSAGE,
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(Authentication authentication) {
        try {
            String username = authentication.getName();
            cartService.clearCart(username);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.DELETE_SUCCESS_MESSAGE,
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @PostMapping("/session/add-item")
    public ResponseEntity<ApiResponse<String>> addToCartBySession(
            @RequestParam String sessionId,
            @RequestBody @Valid AddToCartRequest request) {
        try {
            cartService.addProductToCartBySession(sessionId, request.getProductVariantId(), request.getQuantity());
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.CREATE_SUCCESS_MESSAGE,
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @GetMapping("/session/items")
    public ResponseEntity<ApiResponse<List<CartItemDTO>>> getCartItemsBySession(@RequestParam String sessionId) {
        try {
            List<CartItemDTO> items = cartService.getCartItemsBySession(sessionId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            items
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @PutMapping("/session/update-quantity")
    public ResponseEntity<ApiResponse<String>> updateQuantityBySession(
            @RequestParam String sessionId,
            @RequestBody @Valid UpdateCartItemQuantityRequest request) {
        try {
            cartService.updateCartItemQuantityBySession(sessionId, request.getProductVariantId(), request.getQuantity());
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.UPDATE_SUCCESS_MESSAGE,
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @DeleteMapping("/session/remove-item/{productVariantId}")
    public ResponseEntity<ApiResponse<String>> removeItemBySession(
            @RequestParam String sessionId,
            @PathVariable Integer productVariantId) {
        try {
            cartService.removeItemFromCartBySession(sessionId, productVariantId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.DELETE_SUCCESS_MESSAGE,
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @DeleteMapping("/session/clear")
    public ResponseEntity<ApiResponse<String>> clearCartBySession(@RequestParam String sessionId) {
        try {
            cartService.clearCartBySession(sessionId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.DELETE_SUCCESS_MESSAGE,
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @PostMapping("/merge-session")
    public ResponseEntity<ApiResponse<String>> mergeCart(
            @RequestParam String sessionId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            cartService.mergeSessionCartToCustomer(sessionId, username);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.UPDATE_SUCCESS_MESSAGE,
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncCart(@RequestBody @Valid SyncCartRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(CUSTOMER_NOT_FOUND));

        cartService.syncCartItems(customer, request);

        return ResponseEntity.ok("Cart synced successfully.");
    }

}