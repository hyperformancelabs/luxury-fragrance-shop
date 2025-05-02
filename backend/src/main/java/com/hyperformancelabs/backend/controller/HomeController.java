package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.BrandDTO;
import com.hyperformancelabs.backend.dto.InventoryTransactionDTO;
import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductVariantDTO;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.service.BrandService;
import com.hyperformancelabs.backend.service.InventoryTransactionService;
import com.hyperformancelabs.backend.service.ProductService;
import com.hyperformancelabs.backend.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class HomeController {

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private InventoryTransactionService inventoryTransactionService;

    @Autowired
    private ProductVariantService productVariantService;

    @GetMapping("/")
    public String home(Model model) {
        // Get featured products for the banner
        List<ProductDTO> featuredProducts = productService.getTopSellingProducts(8);
        model.addAttribute("featuredProducts", featuredProducts);

        // Get flash deal products
        List<ProductDTO> flashDealProducts = productService.getTopSellingProducts(6);
        model.addAttribute("flashDealProducts", flashDealProducts);

        // Get new products
        List<InventoryTransactionDTO> inventoryTransactions = inventoryTransactionService.findTop6ImportTransactionsNative();

        Map<Integer, List<ProductVariantDTO>> productVariantMap = inventoryTransactions.stream()
                .map(inventoryTransaction -> productVariantService.findByProductVariantId(inventoryTransaction.getProductVariantId()))
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(productVariantDTO -> productVariantDTO.getProductId()));

        List<ProductDTO> newProducts = productVariantMap.keySet().stream()
                .map(productService::getProductById)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Map<Integer, BigDecimal[]> productPriceRangeMap = new HashMap<>();

        for (Map.Entry<Integer, List<ProductVariantDTO>> entry : productVariantMap.entrySet()) {
            List<ProductVariantDTO> variants = entry.getValue();

            if (variants != null && !variants.isEmpty()) {
                Optional<BigDecimal> min = variants.stream().map(ProductVariantDTO::getPrice).min(Comparator.naturalOrder());
                Optional<BigDecimal> max = variants.stream().map(ProductVariantDTO::getPrice).max(Comparator.naturalOrder());

                max.ifPresent(bigDecimal -> productPriceRangeMap.put(entry.getKey(), new BigDecimal[]{min.get(), bigDecimal}));
            }
        }
        model.addAttribute("productPriceRangeMap", productPriceRangeMap);
        model.addAttribute("newProducts", newProducts);

        // Get best selling products
        List<ProductDTO> bestSellingProducts = productService.getTopSellingProducts(6);
        model.addAttribute("bestSellingProducts", bestSellingProducts);

        // Get top search products
        List<ProductDTO> topSearchProducts = productService.getTopSellingProducts(6);
        model.addAttribute("topSearchProducts", topSearchProducts);

        // Add brand data - Lấy 12 brand đầu tiên
        List<BrandDTO> allBrands = brandService.getAllBrands();
        List<BrandDTO> brands = allBrands.stream()
                .limit(12)
                .collect(Collectors.toList());
        model.addAttribute("brands", brands);
//        model.addAttribute("brands", List.of(
//            "Chanel", "Dior", "Gucci", "Versace", "YSL", "Louis Vuitton",
//            "Burberry", "Prada", "Hermès", "Tom Ford", "Dolce & Gabbana", "Calvin Klein"
//        ));

        // Add blog posts
        model.addAttribute("blogPosts", List.of(
            Map.of(
                "id", 1,
                "title", "Cách chọn nước hoa phù hợp với từng mùa trong năm",
                "image", "/images/blog/blog1.jpg",
                "author", "Admin",
                "date", "15/04/2023",
                "excerpt", "Khám phá cách chọn nước hoa phù hợp với từng mùa để luôn tỏa hương thơm quyến rũ"
            ),
            Map.of(
                "id", 2,
                "title", "Top 5 nước hoa nam được yêu thích nhất 2023",
                "image", "/images/blog/blog2.jpg",
                "author", "Admin",
                "date", "10/04/2023",
                "excerpt", "Điểm qua những mùi hương nam tính đang được săn đón nhiều nhất trong năm nay"
            ),
            Map.of(
                "id", 3,
                "title", "Bí quyết giữ hương thơm nước hoa lâu hơn",
                "image", "/images/blog/blog3.jpg",
                "author", "Admin",
                "date", "05/04/2023",
                "excerpt", "Những mẹo đơn giản giúp nước hoa của bạn lưu hương suốt cả ngày dài"
            ),
            Map.of(
                "id", 4,
                "title", "Nước hoa - Món quà ý nghĩa cho người thân yêu",
                "image", "/images/blog/blog4.jpg",
                "author", "Admin",
                "date", "01/04/2023",
                "excerpt", "Gợi ý những chai nước hoa làm quà tặng cho những dịp đặc biệt"
            ),
            Map.of(
                "id", 5,
                "title", "Cách phân biệt nước hoa thật và giả",
                "image", "/images/blog/blog5.jpg",
                "author", "Admin",
                "date", "28/03/2023",
                "excerpt", "Những dấu hiệu giúp bạn nhận biết nước hoa chính hãng và tránh mua phải hàng giả"
            )
        ));

        return "home";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
