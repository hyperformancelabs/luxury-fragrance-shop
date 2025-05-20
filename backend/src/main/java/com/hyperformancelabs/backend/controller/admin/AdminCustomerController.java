package com.hyperformancelabs.backend.controller.admin;

import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin/customers")
public class AdminCustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public String listCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search,
            Model model) {
        
        // In a real application, this would use customerService.getCustomers(page, search)
        // For now, we'll use sample data
        
        List<Map<String, Object>> customers = new ArrayList<>();
        
        // Sample customer data
        customers.add(createSampleCustomer(1, "Nguyễn Văn A", "0912345678", "nguyenvana@email.com", "active", 120));
        customers.add(createSampleCustomer(2, "Trần Thị B", "0923456789", "tranthib@email.com", "active", 85));
        customers.add(createSampleCustomer(3, "Lê Văn C", "0934567890", "levanc@email.com", "inactive", 50));
        customers.add(createSampleCustomer(4, "Phạm Thị D", "0945678901", "phamthid@email.com", "active", 200));
        customers.add(createSampleCustomer(5, "Hoàng Văn E", "0956789012", "hoangvane@email.com", "banned", 10));
        
        model.addAttribute("customers", customers);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", 3); // Sample value
        model.addAttribute("search", search);
        
        return "admin/customers/list";
    }
    
    @GetMapping("/{id}")
    public String viewCustomer(@PathVariable("id") Integer id, Model model) {
        // In a real application, this would use customerService.getCustomerById(id)
        // For now, we'll use sample data
        
        Map<String, Object> customer = createSampleCustomer(id, "Nguyễn Văn A", "0912345678", "nguyenvana@email.com", "active", 120);
        customer.put("address", "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM");
        customer.put("note", "Khách hàng VIP");
        customer.put("createAt", LocalDateTime.now().minusMonths(3));
        
        model.addAttribute("customer", customer);
        
        // Sample order history
        List<Map<String, Object>> orderHistory = new ArrayList<>();
        orderHistory.add(Map.of(
            "id", "#ORD-12345",
            "date", "12/04/2025",
            "amount", "₫850,000",
            "status", "completed"
        ));
        orderHistory.add(Map.of(
            "id", "#ORD-12300",
            "date", "05/03/2025",
            "amount", "₫1,250,000",
            "status", "completed"
        ));
        
        model.addAttribute("orderHistory", orderHistory);
        
        return "admin/customers/detail";
    }
    
    private Map<String, Object> createSampleCustomer(int id, String name, String phone, String email, String status, int loyaltyPoints) {
        Map<String, Object> customer = new HashMap<>();
        customer.put("id", id);
        customer.put("name", name);
        customer.put("phone", phone);
        customer.put("email", email);
        customer.put("status", status);
        customer.put("loyaltyPoints", loyaltyPoints);
        return customer;
    }
}
