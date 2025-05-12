package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CustomerDTO;
import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public String viewProfile(Model model, Authentication authentication) {
        String username = authentication.getName();
        CustomerDTO customer = customerService.getCustomerByUsername(username);
        model.addAttribute("user", customer);
        return "profile/profile";
    }

    @GetMapping("/orders")
    public String viewOrders(Model model, Authentication authentication) {
        String username = authentication.getName();
        CustomerDTO customer = customerService.getCustomerByUsername(username);
        List<OrderDTO> orders = orderService.findOrdersByCustomerId(customer.getCustomerId());
        model.addAttribute("orders", orders);
        return "profile/orders";
    }

    @GetMapping("/edit")
    public String editProfile(Model model, Authentication authentication) {
        String username = authentication.getName();
        CustomerDTO customer = customerService.getCustomerByUsername(username);
        model.addAttribute("user", customer);
        return "profile/edit-profile";
    }
}
