package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/shop")
public class ShopController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public String showProductList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String search,
            Model model) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> productPage;
        
        if (brand != null && !brand.isEmpty()) {
            productPage = productService.getProductsByBrandName(brand, pageable);
            model.addAttribute("currentBrand", brand);
        } else if (search != null && !search.isEmpty()) {
            productPage = productService.getProductsByProductName(search, pageable);
            model.addAttribute("currentSearch", search);
        } else {
            productPage = productService.getAllProducts(pageable);
        }
        
        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("totalItems", productPage.getTotalElements());
        
        return "shop/product-list";
    }
    
    @GetMapping("/product/{id}")
    public String showProductDetail(@PathVariable Integer id, Model model) {
        ProductDTO product = productService.getProductById(id);
        if (product == null) {
            return "error/404";
        }
        
        List<ProductDTO> relatedProducts = productService.getRelatedProducts(id, 4);
        
        model.addAttribute("product", product);
        model.addAttribute("relatedProducts", relatedProducts);
        
        return "shop/product-detail";
    }
    
    @GetMapping("/top-selling")
    public String showTopSellingProducts(
            @RequestParam(required = false) String category,
            Model model) {
        
        List<ProductDTO> topProducts = productService.getTopSellingProducts(10);
        
        model.addAttribute("products", topProducts);
        model.addAttribute("category", category);
        
        return "shop/top-selling";
    }
    
    @GetMapping("/random")
    public String showRandomProducts(Model model) {
        // For now, we'll just use the top selling products as a placeholder
        // In a real implementation, you would have a method to get random products
        List<ProductDTO> randomProducts = productService.getTopSellingProducts(5);
        
        model.addAttribute("products", randomProducts);
        
        return "shop/random-products";
    }
}
