package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.service.BrandService;
import com.hyperformancelabs.backend.service.InventoryTransactionService;
import com.hyperformancelabs.backend.service.ProductService;
import com.hyperformancelabs.backend.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
        List<ProductDTO> flashSaleProducts = new ArrayList<>();
        List<FlashSaleProductDTO> flashDealProducts = productService.getFlashSaleProducts();
        for(FlashSaleProductDTO flashDealProduct : flashDealProducts) {
            flashSaleProducts.add(productService.getProductById(flashDealProduct.getProductId()));
        }

        Map<Integer, List<ProductVariantDTO>> flashSaleProductVariantMap = flashDealProducts.stream()
                .map(flashDealProduct -> productVariantService.getProductVariantsByProductId(flashDealProduct.getProductId()))
                .filter(Objects::nonNull)
                .flatMap(List::stream)
                .collect(Collectors.groupingBy(ProductVariantDTO::getProductId));

        Map<Integer, BigDecimal[]> flashSaleProductPriceRangeMap = new HashMap<>();
        Map<Integer, String> flashSaleProductVariants = new HashMap<>();
        for (Map.Entry<Integer, List<ProductVariantDTO>> entry : flashSaleProductVariantMap.entrySet()) {
            List<ProductVariantDTO> variants = entry.getValue();

            if (variants != null && !variants.isEmpty()) {
                // Tính toán giá thấp nhất và cao nhất
                Optional<BigDecimal> min = variants.stream().map(ProductVariantDTO::getPrice).min(Comparator.naturalOrder());
                Optional<BigDecimal> max = variants.stream().map(ProductVariantDTO::getPrice).max(Comparator.naturalOrder());

                max.ifPresent(bigDecimal -> flashSaleProductPriceRangeMap.put(entry.getKey(), new BigDecimal[]{min.get(), bigDecimal}));

                // Thêm biến thể vào map
                if(!flashSaleProductVariants.containsKey(entry.getKey())) {
                    flashSaleProductVariants.put(entry.getKey(), convertVariantsToJson(variants));
                    String variantsJson = convertVariantsToJson(variants);
                    flashSaleProductVariants.put(entry.getKey(), variantsJson);
                    flashSaleProductVariantMap.put(entry.getKey(), variants);
                } else {
                    flashSaleProductVariants.put(entry.getKey(), flashSaleProductVariants.get(entry.getKey()));
                }
            }
        }

        model.addAttribute("flashDealProducts", flashSaleProducts);
        model.addAttribute("flashSaleProductPriceRangeMap", flashSaleProductPriceRangeMap);
        model.addAttribute("flashSaleProductVariants", flashSaleProductVariants);


        // Tạo map chứa danh sách biến thể cho mỗi sản phẩm
        Map<Integer, String> productVariantsMap = new HashMap<>();
        Map<Integer, Integer> productFirstVariantMap = new HashMap<>();

        // Thêm biến thể cho các sản phẩm nổi bật
        for (ProductDTO product : featuredProducts) {
            List<ProductVariantDTO> variants = productVariantService.getProductVariantsByProductId(product.getProductId());
            if (!variants.isEmpty()) {
                productFirstVariantMap.put(product.getProductId(), variants.get(0).getProductVariantId());
                productVariantsMap.put(product.getProductId(), convertVariantsToJson(variants));
            }
        }

        // Thêm biến thể cho các sản phẩm flash deal
        for (ProductDTO product : featuredProducts) {
            if (!productVariantsMap.containsKey(product.getProductId())) {
                List<ProductVariantDTO> variants = productVariantService.getProductVariantsByProductId(product.getProductId());
                if (!variants.isEmpty()) {
                    productFirstVariantMap.put(product.getProductId(), variants.get(0).getProductVariantId());
                    productVariantsMap.put(product.getProductId(), convertVariantsToJson(variants));
                }
            }
        }

        // Add the maps to the model
        model.addAttribute("productFirstVariantMap", productFirstVariantMap);
        model.addAttribute("productVariantsMap", productVariantsMap);


        // Get new products
        List<InventoryTransactionDTO> inventoryTransactions = inventoryTransactionService.findTop6ImportTransactionsNative();

        Map<Integer, List<ProductVariantDTO>> productVariantMap = inventoryTransactions.stream()
                .map(inventoryTransaction -> productVariantService.getProductVariantById(inventoryTransaction.getProductVariantId()))
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(productVariantDTO -> productVariantDTO.getProductId()));

        List<ProductDTO> newProducts = productVariantMap.keySet().stream()
                .map(productService::getProductById)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Map<Integer, BigDecimal[]> newProductPriceRangeMap = new HashMap<>();
        Map<Integer, String> newProductVariants = new HashMap<>();

        for (Map.Entry<Integer, List<ProductVariantDTO>> entry : productVariantMap.entrySet()) {
            List<ProductVariantDTO> variants = entry.getValue();

            if (variants != null && !variants.isEmpty()) {
                // Tính toán giá thấp nhất và cao nhất
                Optional<BigDecimal> min = variants.stream().map(ProductVariantDTO::getPrice).min(Comparator.naturalOrder());
                Optional<BigDecimal> max = variants.stream().map(ProductVariantDTO::getPrice).max(Comparator.naturalOrder());

                max.ifPresent(bigDecimal -> newProductPriceRangeMap.put(entry.getKey(), new BigDecimal[]{min.get(), bigDecimal}));

                // Thêm biến thể vào map
                if (!productVariantsMap.containsKey(entry.getKey())) {
                    productFirstVariantMap.put(entry.getKey(), variants.get(0).getProductVariantId());
                    String variantsJson = convertVariantsToJson(variants);
                    newProductVariants.put(entry.getKey(), variantsJson);
                    productVariantsMap.put(entry.getKey(), variantsJson);
                } else {
                    newProductVariants.put(entry.getKey(), productVariantsMap.get(entry.getKey()));
                }
            }
        }

        model.addAttribute("productPriceRangeMap", newProductPriceRangeMap);
        model.addAttribute("newProducts", newProducts);
        model.addAttribute("newProductVariants", newProductVariants);

        // Get best selling products
        List<ProductDTO> bestSellingProducts = productService.getTopSellingProducts(6);

        // Tạo map chứa danh sách biến thể cho mỗi sản phẩm bán chạy nhất
        Map<Integer, String> bestSellingProductVariants = new HashMap<>();
        for (ProductDTO product : bestSellingProducts) {
            if (!productVariantsMap.containsKey(product.getProductId())) {
                List<ProductVariantDTO> variants = productVariantService.getProductVariantsByProductId(product.getProductId());
                if (!variants.isEmpty()) {
                    productFirstVariantMap.put(product.getProductId(), variants.get(0).getProductVariantId());
                    bestSellingProductVariants.put(product.getProductId(), convertVariantsToJson(variants));
                    productVariantsMap.put(product.getProductId(), convertVariantsToJson(variants));
                }
            } else {
                bestSellingProductVariants.put(product.getProductId(), productVariantsMap.get(product.getProductId()));
            }
        }

        model.addAttribute("bestSellingProducts", bestSellingProducts);
        model.addAttribute("bestSellingProductVariants", bestSellingProductVariants);

        // Get top search products
        List<ProductDTO> topSearchProducts = productService.getTopSellingProducts(6);

        // Tạo map chứa danh sách biến thể cho mỗi sản phẩm tìm kiếm nhiều nhất
        Map<Integer, String> topSearchProductVariants = new HashMap<>();
        for (ProductDTO product : topSearchProducts) {
            if (!productVariantsMap.containsKey(product.getProductId())) {
                List<ProductVariantDTO> variants = productVariantService.getProductVariantsByProductId(product.getProductId());
                if (!variants.isEmpty()) {
                    productFirstVariantMap.put(product.getProductId(), variants.get(0).getProductVariantId());
                    topSearchProductVariants.put(product.getProductId(), convertVariantsToJson(variants));
                    productVariantsMap.put(product.getProductId(), convertVariantsToJson(variants));
                }
            } else {
                topSearchProductVariants.put(product.getProductId(), productVariantsMap.get(product.getProductId()));
            }
        }

        model.addAttribute("topSearchProducts", topSearchProducts);
        model.addAttribute("topSearchProductVariants", topSearchProductVariants);

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

    /**
     * Chuyển đổi danh sách biến thể thành chuỗi JSON
     * @param variants Danh sách biến thể
     * @return Chuỗi JSON
     */
    private String convertVariantsToJson(List<ProductVariantDTO> variants) {
        if (variants == null || variants.isEmpty()) {
            return "[]";
        }

        try {
            // Chuyển đổi danh sách biến thể thành danh sách các map để dễ dàng hơn trong JSON
            List<Map<String, Object>> variantsList = new ArrayList<>();
            for (ProductVariantDTO variant : variants) {
                Map<String, Object> variantMap = new HashMap<>();
                variantMap.put("id", variant.getProductVariantId());
                variantMap.put("volume", variant.getVolume());
                variantMap.put("price", variant.getPrice());
                variantMap.put("discountPrice", variant.getDiscountPrice());
                variantMap.put("stock", variant.getQuantityInStock());
                variantsList.add(variantMap);
            }

            // Chuyển đổi danh sách thành chuỗi JSON
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(variantsList);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "[]";
        }
    }
}
