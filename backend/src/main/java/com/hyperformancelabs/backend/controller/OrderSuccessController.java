package com.hyperformancelabs.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/order-success")
public class OrderSuccessController {

    @GetMapping
    public String orderSuccess(@RequestParam(required = false) String orderId, Model model) {
        // Trong thực tế, bạn sẽ lấy thông tin đơn hàng từ database dựa trên orderId
        // Ở đây, chúng ta sẽ tạo dữ liệu mẫu
        
        // Tạo mã đơn hàng nếu không có
        if (orderId == null || orderId.isEmpty()) {
            orderId = "APH" + System.currentTimeMillis();
        }
        
        // Tạo thông tin đơn hàng
        Map<String, Object> order = new HashMap<>();
        order.put("orderId", orderId);
        order.put("orderDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        order.put("paymentMethod", "Thanh toán khi nhận hàng (COD)");
        order.put("shippingAddress", "123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh");
        order.put("customerName", "Nguyễn Văn A");
        order.put("customerEmail", "nguyenvana@example.com");
        order.put("customerPhone", "0987654321");
        
        // Tạo danh sách sản phẩm trong đơn hàng
        List<Map<String, Object>> orderItems = new ArrayList<>();
        orderItems.add(createOrderItem(1, "Nước Hoa Nữ Versace Bright Crystal EDT", 2, 2400000, "/images/products/versace-bright-crystal.jpg", "50ml"));
        orderItems.add(createOrderItem(2, "Nước Hoa Nam Dior Sauvage EDT", 1, 3200000, "/images/products/dior-sauvage.jpg", "100ml"));
        
        // Tính tổng tiền
        int subtotal = orderItems.stream()
                .mapToInt(item -> (int) item.get("price") * (int) item.get("quantity"))
                .sum();
        
        // Phí vận chuyển
        int shipping = subtotal > 1000000 ? 0 : 30000;
        
        // Tổng cộng
        int total = subtotal + shipping;
        
        model.addAttribute("order", order);
        model.addAttribute("orderItems", orderItems);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("shipping", shipping);
        model.addAttribute("total", total);
        
        return "order/order-success";
    }
    
    private Map<String, Object> createOrderItem(int id, String name, int quantity, int price, String imageUrl, String size) {
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
