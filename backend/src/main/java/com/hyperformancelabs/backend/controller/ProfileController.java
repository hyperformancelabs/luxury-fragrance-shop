package com.hyperformancelabs.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    @GetMapping
    public String viewProfile(Model model) {
        // Trong thực tế, bạn sẽ lấy thông tin người dùng từ session hoặc database
        // Ở đây, chúng ta sẽ tạo dữ liệu mẫu
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("name", "Nguyễn Văn A");
        user.put("email", "nguyenvana@example.com");
        user.put("phone", "0987654321");
        user.put("address", "123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh");
        user.put("avatar", "/images/avatar.jpg");
        
        model.addAttribute("user", user);
        
        return "profile/profile";
    }
    
    @GetMapping("/orders")
    public String viewOrders(Model model) {
        // Trong thực tế, bạn sẽ lấy danh sách đơn hàng từ database
        // Ở đây, chúng ta sẽ tạo dữ liệu mẫu
        List<Map<String, Object>> orders = new ArrayList<>();
        
        // Tạo một số đơn hàng mẫu
        orders.add(createOrder("APH123456789", LocalDateTime.now().minusDays(2), 8000000, "Đã giao hàng"));
        orders.add(createOrder("APH987654321", LocalDateTime.now().minusDays(10), 5500000, "Đã giao hàng"));
        orders.add(createOrder("APH456789123", LocalDateTime.now().minusDays(30), 3200000, "Đã giao hàng"));
        orders.add(createOrder("APH789123456", LocalDateTime.now().minusDays(1), 4700000, "Đang giao hàng"));
        orders.add(createOrder("APH321654987", LocalDateTime.now().minusHours(5), 6200000, "Đang xử lý"));
        
        model.addAttribute("orders", orders);
        
        return "profile/orders";
    }
    
    @GetMapping("/edit")
    public String editProfile(Model model) {
        // Trong thực tế, bạn sẽ lấy thông tin người dùng từ session hoặc database
        // Ở đây, chúng ta sẽ tạo dữ liệu mẫu
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("name", "Nguyễn Văn A");
        user.put("email", "nguyenvana@example.com");
        user.put("phone", "0987654321");
        user.put("address", "123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh");
        user.put("avatar", "/images/avatar.jpg");
        
        model.addAttribute("user", user);
        
        return "profile/edit-profile";
    }
    
    private Map<String, Object> createOrder(String orderId, LocalDateTime orderDate, int total, String status) {
        Map<String, Object> order = new HashMap<>();
        order.put("orderId", orderId);
        order.put("orderDate", orderDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        order.put("total", total);
        order.put("status", status);
        return order;
    }
}
