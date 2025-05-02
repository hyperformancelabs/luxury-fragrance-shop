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
@RequestMapping("/wishlist")
public class WishlistController {

    @GetMapping
    public String viewWishlist(Model model) {
        // Tạo dữ liệu mẫu cho danh sách yêu thích
        List<Map<String, Object>> wishlistItems = new ArrayList<>();
        
        // Thêm một số sản phẩm mẫu vào danh sách yêu thích
        wishlistItems.add(createWishlistItem(1, "Nước Hoa Nữ Versace Bright Crystal EDT", "/images/products/versace-bright-crystal.jpg", true, 
                List.of(
                    Map.of("value", "50ml", "label", "50ml", "price", 2400000),
                    Map.of("value", "100ml", "label", "100ml", "price", 3500000)
                )));
        
        wishlistItems.add(createWishlistItem(2, "Nước Hoa Nam Dior Sauvage EDT", "/images/products/dior-sauvage.jpg", true, 
                List.of(
                    Map.of("value", "60ml", "label", "60ml", "price", 2800000),
                    Map.of("value", "100ml", "label", "100ml", "price", 3800000)
                )));
        
        wishlistItems.add(createWishlistItem(3, "Nước Hoa Unisex Jo Malone Wood Sage & Sea Salt", "/images/products/jo-malone.jpg", false, 
                List.of(
                    Map.of("value", "30ml", "label", "30ml", "price", 1900000),
                    Map.of("value", "100ml", "label", "100ml", "price", 3200000)
                )));
        
        wishlistItems.add(createWishlistItem(4, "Nước Hoa Nữ Chanel Coco Mademoiselle EDP", "/images/products/chanel-coco.jpg", true, 
                List.of(
                    Map.of("value", "50ml", "label", "50ml", "price", 2700000),
                    Map.of("value", "75ml", "label", "75ml", "price", 3000000)
                )));
        
        model.addAttribute("wishlistItems", wishlistItems);
        
        return "wishlist/wishlist";
    }
    
    private Map<String, Object> createWishlistItem(int id, String name, String image, boolean inStock, List<Map<String, Object>> sizes) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", id);
        item.put("name", name);
        item.put("image", image);
        item.put("inStock", inStock);
        item.put("sizes", sizes);
        return item;
    }
}
