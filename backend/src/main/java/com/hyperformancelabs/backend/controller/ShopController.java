package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductVariantDTO;
import com.hyperformancelabs.backend.service.ProductService;
import com.hyperformancelabs.backend.service.ProductVariantService;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private ProductVariantService productVariantService;

    @GetMapping("/product/{id}")
    public String showProductDetail(@PathVariable Integer id, Model model) {
        ProductDTO product = productService.getProductById(id);
        if (product == null) {
            return "error/404";
        }

        List<ProductDTO> relatedProducts = productService.getRelatedProducts(id, 4);

        // Lấy danh sách biến thể sản phẩm (kích thước, giá)
        List<ProductVariantDTO> productVariants = productVariantService.getProductVariantsByProductId(id);

        // Nếu không có biến thể nào, tạo dữ liệu mẫu
//        if (productVariants.isEmpty()) {
//            productVariants = new ArrayList<>();
//            productVariants.add(new ProductVariantDTO(1, id, 50, new BigDecimal(500000)));
//            productVariants.add(new ProductVariantDTO(2, id, 75, new BigDecimal(1250000)));
//            productVariants.add(new ProductVariantDTO(3, id, 100, new BigDecimal(2500000)));
//        }

        // Lấy giá của biến thể đầu tiên làm giá mặc định
        BigDecimal defaultPrice = productVariants.get(0).getPrice();
        BigDecimal originalPrice = defaultPrice.multiply(new BigDecimal("1.2")).setScale(0, RoundingMode.HALF_UP);

        // Thêm dữ liệu vào model
        model.addAttribute("product", product);
        model.addAttribute("relatedProducts", relatedProducts);
        model.addAttribute("productVariants", productVariants);
        model.addAttribute("rating", 4.5);
        model.addAttribute("reviewCount", 125);
        model.addAttribute("availability", "Còn hàng");
        model.addAttribute("originalPrice", originalPrice);
        model.addAttribute("salePrice", defaultPrice);

        // Thêm dữ liệu mẫu cho các hình ảnh sản phẩm
        List<String> images = new ArrayList<>();
        images.add(product.getImageUrl());
        images.add(product.getImageUrl()); // Trong thực tế, bạn sẽ có nhiều hình ảnh khác nhau
        images.add(product.getImageUrl());
        model.addAttribute("images", images);

        // Thêm dữ liệu mẫu cho các khuyến nghị theo mùa
        Map<String, Integer> seasonalRecommendations = new HashMap<>();
        seasonalRecommendations.put("MÙA ĐÔNG", 30);
        seasonalRecommendations.put("MÙA XUÂN", 70);
        seasonalRecommendations.put("MÙA HẠ", 90);
        seasonalRecommendations.put("MÙA THU", 60);
        seasonalRecommendations.put("BAN NGÀY", 80);
        seasonalRecommendations.put("BAN ĐÊM", 50);
        model.addAttribute("seasonalRecommendations", seasonalRecommendations);

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
