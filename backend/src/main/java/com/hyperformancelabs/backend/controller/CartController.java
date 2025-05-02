package com.hyperformancelabs.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/cart")
public class CartController {

    @GetMapping
    public String viewCart(Model model) {
        // Trong thực tế, bạn sẽ lấy thông tin giỏ hàng từ session hoặc database
        // Ở đây, chúng ta sẽ tạo dữ liệu mẫu
        List<Map<String, Object>> cartItems = new ArrayList<>();
        
        // Thêm một số sản phẩm mẫu vào giỏ hàng
        cartItems.add(createCartItem(1, "Nước Hoa Nữ Versace Bright Crystal EDT", 2, 2400000, "/images/products/versace-bright-crystal.jpg", "50ml"));
        cartItems.add(createCartItem(2, "Nước Hoa Nam Dior Sauvage EDT", 1, 3200000, "/images/products/dior-sauvage.jpg", "100ml"));
        
        // Tính tổng tiền
        int totalAmount = cartItems.stream()
                .mapToInt(item -> (int) item.get("price") * (int) item.get("quantity"))
                .sum();
        
        model.addAttribute("cartItems", cartItems);
        model.addAttribute("totalAmount", totalAmount);
        model.addAttribute("itemCount", cartItems.size());
        
        return "cart/cart";
    }
    
    private Map<String, Object> createCartItem(int id, String name, int quantity, int price, String imageUrl, String size) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", id);
        item.put("name", name);
        item.put("quantity", quantity);
        item.put("price", price);
        item.put("imageUrl", imageUrl);
        item.put("size", size);
        return item;
    }
}
