package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.AddToCartRequest;
import com.hyperformancelabs.backend.dto.CartItemDTO;
import com.hyperformancelabs.backend.dto.CartItemResponse;
import com.hyperformancelabs.backend.dto.UpdateCartItemQuantityRequest;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add-item")
    public ResponseEntity<ApiResponse<String>> addToCart(@RequestBody @Valid AddToCartRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.addProductToCart(username, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(new ApiResponse<>(200, "success", "Thêm vào giỏ hàng thành công", null));
    }

    @GetMapping("/items")
    public ResponseEntity<ApiResponse<List<CartItemDTO>>> getCartItems() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CartItemDTO> items = cartService.getCartItemsForCustomer(username);
        return ResponseEntity.ok(new ApiResponse<>(200, "success", "Lấy giỏ hàng thành công", items));
    }
    @PutMapping("/update-quantity")
    public ResponseEntity<ApiResponse<String>> updateQuantity(
            @RequestBody @Valid UpdateCartItemQuantityRequest request
    ) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.updateCartItemQuantity(username, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(
                new ApiResponse<>(200, "success", "Cập nhật số lượng thành công", null)
        );
    }

    @DeleteMapping("/remove-item/{productId}")
    public ApiResponse removeItem(@PathVariable Integer productId, Authentication authentication) {
        try {
            String username = authentication.getName(); // 👈 lấy username từ token
            cartService.removeItemFromCart(username, productId);
            return new ApiResponse(200, "Xoá sản phẩm khỏi giỏ hàng thành công", null, null);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ApiResponse(500, "Lỗi khi xoá sản phẩm khỏi giỏ hàng: " + ex.getMessage(), null, null);
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(Authentication authentication) {
        try {
            String username = authentication.getName();
            cartService.clearCart(username);
            return ResponseEntity.ok(new ApiResponse<>(200, "success", "Đã xoá toàn bộ sản phẩm khỏi giỏ hàng", null));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "error", "Lỗi khi xoá giỏ hàng: " + ex.getMessage(), null));
        }
    }

    @PostMapping("/session/add-item")
    public ResponseEntity<ApiResponse<String>> addToCartBySession(
            @RequestParam String sessionId,
            @RequestBody @Valid AddToCartRequest request) {
        cartService.addProductToCartBySession(sessionId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(new ApiResponse<>(200, "success", "Thêm vào giỏ hàng (session) thành công", null));
    }

    @GetMapping("/session/items")
    public ResponseEntity<ApiResponse<List<CartItemDTO>>> getCartItemsBySession(@RequestParam String sessionId) {
        List<CartItemDTO> items = cartService.getCartItemsBySession(sessionId);
        return ResponseEntity.ok(new ApiResponse<>(200, "success", "Lấy giỏ hàng (session) thành công", items));
    }

    @PutMapping("/session/update-quantity")
    public ResponseEntity<ApiResponse<String>> updateQuantityBySession(
            @RequestParam String sessionId,
            @RequestBody @Valid UpdateCartItemQuantityRequest request) {
        cartService.updateCartItemQuantityBySession(sessionId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(new ApiResponse<>(200, "success", "Cập nhật số lượng (session) thành công", null));
    }

    @DeleteMapping("/session/remove-item/{productId}")
    public ApiResponse removeItemBySession(@RequestParam String sessionId, @PathVariable Integer productId) {
        try {
            cartService.removeItemFromCartBySession(sessionId, productId);
            return new ApiResponse(200, "Xoá sản phẩm (session) khỏi giỏ hàng thành công", null, null);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ApiResponse(500, "Lỗi khi xoá sản phẩm: " + ex.getMessage(), null, null);
        }
    }

    @DeleteMapping("/session/clear")
    public ResponseEntity<ApiResponse<String>> clearCartBySession(@RequestParam String sessionId) {
        try {
            cartService.clearCartBySession(sessionId);
            return ResponseEntity.ok(new ApiResponse<>(200, "success", "Đã xoá toàn bộ giỏ hàng (session)", null));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "error", "Lỗi khi xoá giỏ hàng: " + ex.getMessage(), null));
        }
    }

    @PostMapping("/merge-session")
    public ResponseEntity<ApiResponse<String>> mergeCart(
            @RequestParam String sessionId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            cartService.mergeSessionCartToCustomer(sessionId, username);
            return ResponseEntity.ok(new ApiResponse<>(200, "success", "Merge giỏ hàng thành công", null));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "error", "Lỗi khi merge giỏ hàng: " + ex.getMessage(), null));
        }
    }

}
