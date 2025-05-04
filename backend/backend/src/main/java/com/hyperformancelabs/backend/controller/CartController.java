package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CartDTO;
import com.hyperformancelabs.backend.dto.CartItemDTO;
import com.hyperformancelabs.backend.dto.CartItemViewDTO;
import com.hyperformancelabs.backend.dto.request.AddToCartRequest;
import com.hyperformancelabs.backend.service.CartService;
import com.hyperformancelabs.backend.service.ProductService;
import com.hyperformancelabs.backend.service.ProductVariantService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ProductVariantService productVariantService;

    /**
     * Hiển thị trang giỏ hàng
     */
    @GetMapping
    public String viewCart(Model model, HttpServletRequest request) {
        // Lấy thông tin người dùng và session
        String username = getCurrentUsername();
        String sessionId = getOrCreateSessionId(request);
        
        // Lấy danh sách sản phẩm trong giỏ hàng
        List<CartItemDTO> cartItems = cartService.getCartItems(username, sessionId);
        
        // Chuyển đổi CartItemDTO thành CartItemViewDTO để hiển thị trên giao diện
        List<CartItemViewDTO> cartItemViews = convertToCartItemViewDTOs(cartItems);
        
        // Lấy thông tin giỏ hàng
        CartDTO cart = cartService.getCart(username, sessionId);
        
        model.addAttribute("cartItems", cartItemViews);
        model.addAttribute("totalAmount", cart.getTotalAmount());
        model.addAttribute("itemCount", cartItems.size());
        
        return "cart/cart";
    }
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @PostMapping("/add")
    public String addToCart(
            @RequestParam Integer productVariantId,
            @RequestParam Integer quantity,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes) {
        
        String username = getCurrentUsername();
        String sessionId = getOrCreateSessionId(request);
        
        AddToCartRequest addToCartRequest = new AddToCartRequest();
        addToCartRequest.setProductVariantId(productVariantId);
        addToCartRequest.setQuantity(quantity);
        
        try {
            cartService.addToCart(username, sessionId, addToCartRequest);
            redirectAttributes.addFlashAttribute("successMessage", "Sản phẩm đã được thêm vào giỏ hàng");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể thêm sản phẩm vào giỏ hàng: " + e.getMessage());
        }
        
        // Chuyển hướng về trang trước đó hoặc trang giỏ hàng
        String referer = request.getHeader("Referer");
        return "redirect:" + (referer != null ? referer : "/cart");
    }
    
    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    @PostMapping("/update")
    public String updateCartItemQuantity(
            @RequestParam Integer cartItemId,
            @RequestParam Integer quantity,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes) {
        
        if (quantity <= 0) {
            redirectAttributes.addFlashAttribute("errorMessage", "Số lượng phải lớn hơn 0");
            return "redirect:/cart";
        }
        
        String username = getCurrentUsername();
        String sessionId = getOrCreateSessionId(request);
        
        try {
            cartService.updateCartItemQuantity(cartItemId, quantity, username, sessionId);
            redirectAttributes.addFlashAttribute("successMessage", "Số lượng đã được cập nhật");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể cập nhật số lượng: " + e.getMessage());
        }
        
        return "redirect:/cart";
    }
    
    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    @PostMapping("/remove")
    public String removeCartItem(
            @RequestParam Integer cartItemId,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes) {
        
        String username = getCurrentUsername();
        String sessionId = getOrCreateSessionId(request);
        
        try {
            cartService.removeCartItem(cartItemId, username, sessionId);
            redirectAttributes.addFlashAttribute("successMessage", "Sản phẩm đã được xóa khỏi giỏ hàng");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể xóa sản phẩm: " + e.getMessage());
        }
        
        return "redirect:/cart";
    }
    
    /**
     * Chuyển đổi CartItemDTO thành CartItemViewDTO
     */
    private List<CartItemViewDTO> convertToCartItemViewDTOs(List<CartItemDTO> cartItems) {
        List<CartItemViewDTO> result = new ArrayList<>();
        
        for (CartItemDTO item : cartItems) {
            var productVariant = productVariantService.findByProductVariantId(item.getProductVariantId());
            if (productVariant != null) {
                var product = productService.getProductById(productVariant.getProductId());
                if (product != null) {
                    CartItemViewDTO viewDTO = new CartItemViewDTO(
                            item.getCartItemId(),
                            item.getCartId(),
                            item.getProductVariantId(),
                            item.getQuantity(),
                            item.getUnitPrice(),
                            item.getNote(),
                            item.getIsSelected(),
                            product.getProductName(),
                            product.getImageUrl(),
                            productVariant.getVolume() + "ml",
                            item.getUnitPrice()
                    );
                    result.add(viewDTO);
                }
            }
        }
        
        return result;
    }
    
    /**
     * Lấy username của người dùng hiện tại
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
                !authentication.getPrincipal().equals("anonymousUser")) {
            return authentication.getName();
        }
        return null;
    }
    
    /**
     * Lấy hoặc tạo sessionId
     */
    private String getOrCreateSessionId(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        String sessionId = (String) session.getAttribute("CART_SESSION_ID");
        
        if (sessionId == null) {
            sessionId = UUID.randomUUID().toString();
            session.setAttribute("CART_SESSION_ID", sessionId);
        }
        
        return sessionId;
    }
}
