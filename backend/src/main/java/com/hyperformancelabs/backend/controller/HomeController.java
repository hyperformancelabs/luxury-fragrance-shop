package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private ProductService productService;

    @GetMapping("/")
    public String home(Model model) {
        // Get featured products for the home page
        List<ProductDTO> featuredProducts = productService.getTopSellingProducts(8);
        model.addAttribute("featuredProducts", featuredProducts);
        
        // Get new products
        // In a real implementation, you would have a method to get new products
        List<ProductDTO> newProducts = productService.getTopSellingProducts(4);
        model.addAttribute("newProducts", newProducts);
        
        // Get best selling products
        List<ProductDTO> bestSellingProducts = productService.getTopSellingProducts(4);
        model.addAttribute("bestSellingProducts", bestSellingProducts);
        
        return "home";
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/about")
    public String about() {
        return "about";
    }
    
    @GetMapping("/contact")
    public String contact() {
        return "contact";
    }
}
