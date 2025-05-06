package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.payload.PagedResponse;
import com.hyperformancelabs.backend.service.impl.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductServiceImpl productService;

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProducts(@RequestParam(defaultValue = "0") int page) {
        try {
            Page<ProductDTO> products = productService.getAllProducts(page);

            Map<String, Object> data = new HashMap<>();
            data.put("items", products.getContent()); // list sản phẩm
            data.put("currentPage", products.getNumber());
            data.put("totalItems", products.getTotalElements());
            data.put("totalPages", products.getTotalPages());

            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    data
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        }
    }

//    @GetMapping("/brand/{brandName}")
//    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getProductsByBrand(
//            @PathVariable String brandName,
//            @RequestParam(defaultValue = "0") int page) {
//        try {
//            Page<ProductDTO> products = productService.getProductsByBrand(brandName, page);
//            return ResponseEntity.ok(
//                new ApiResponse<>(
//                    ApiResponseStatus.SUCCESS_CODE,
//                    ApiResponseStatus.SUCCESS_STATUS,
//                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
//                    products
//                )
//            );
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(
//                new ApiResponse<>(
//                    ApiResponseStatus.BAD_REQUEST_CODE,
//                    ApiResponseStatus.ERROR_STATUS,
//                    e.getMessage(),
//                    null
//                )
//            );
//        }
//    }
@GetMapping("/by-brand")
public ResponseEntity<ApiResponse<Map<String, Object>>> getProductsByBrandPaged(
        @RequestParam String brandName,
        @RequestParam(defaultValue = "0") int page
) {
    try {
        PagedResponse<ProductCard> pagedResponse = productService.getProductVariantsByBrandNamePaged(brandName, page);
        
        Map<String, Object> data = new HashMap<>();
        data.put("items", pagedResponse.getContent());
        data.put("currentPage", pagedResponse.getPageNumber());
        data.put("totalItems", pagedResponse.getTotalItems());
        data.put("totalPages", pagedResponse.getTotalPages());
        
        return ResponseEntity.ok(
            new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                ApiResponseStatus.GET_SUCCESS_MESSAGE,
                data
            )
        );
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(
            new ApiResponse<>(
                ApiResponseStatus.BAD_REQUEST_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            )
        );
    }
}


    @GetMapping("/top-selling-products")
    public ResponseEntity<ApiResponse<List<TopSellingProductDTO>>> getProducts(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "limit", defaultValue = "10") int limit
    ) {
        try {
            if ("bestseller".equalsIgnoreCase(sort)) {
                List<TopSellingProductDTO> topSellingProducts = productService.getTopSellingProducts(category, limit)
                        .stream()
                        .limit(limit)
                        .toList();
                
                return ResponseEntity.ok(
                    new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        ApiResponseStatus.GET_SUCCESS_MESSAGE,
                        topSellingProducts
                    )
                );
            }
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    List.of()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Map<String, Object>>> searchProductsByName(
            @RequestParam("name") String productName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> products = productService.findByProductNameContainingIgnoreCase(productName, pageable);

            Map<String, Object> data = new HashMap<>();
            data.put("items", products.getContent());
            data.put("currentPage", products.getNumber());
            data.put("totalItems", products.getTotalElements());
            data.put("totalPages", products.getTotalPages());

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            data
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @GetMapping("/random-10")
    public List<Random10Product> getRandom10Products() {
        return productService.getRandom10Product();
    }

    @GetMapping("/variants")
    public List<ProductCard> getProductVariantsGroupedByProduct() {
        return productService.getProductVariantsGroupedByProduct();
    }

    @GetMapping("/flash-sale")
    public ResponseEntity<List<ProductCard>> getFlashSaleProducts(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer volume,
            @RequestParam(required = false) String brandName,
            @RequestParam(required = false) String suitableGender,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String toneScent
    ) {
        List<ProductCard> result = productService.getFilteredFlashSaleProducts(
                minPrice, maxPrice, volume, brandName, suitableGender, style, toneScent
        );
        return ResponseEntity.ok(result);
    }




    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> getProductDetail(@PathVariable Integer id) {
        try {
            ProductDetailDTO productDetail = productService.getProductDetailById(id);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    productDetail
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.warn("Product not found: {}", e.getMessage());
            return ResponseEntity.status(ApiResponseStatus.NOT_FOUND_CODE).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error processing product detail request for ID: " + id, e);
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Error processing request";
            return ResponseEntity.status(ApiResponseStatus.BAD_REQUEST_CODE).body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    errorMessage,
                    null
                )
            );
        }
    }

    @GetMapping("/category")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductsByGender(
            @RequestParam("gender") String gender,
            @RequestParam(value = "page", defaultValue = "0") int page
    ) {
        try {
            // Normalize input
            String normalizedGender = capitalizeFirstLetter(gender.trim().toLowerCase());

            if (!List.of("Women", "Men", "Unisex").contains(normalizedGender)) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(
                                ApiResponseStatus.BAD_REQUEST_CODE,
                                ApiResponseStatus.ERROR_STATUS,
                                "Giá trị gender không hợp lệ. Chỉ chấp nhận: Women, Men, Unisex.",
                                null
                        )
                );
            }

            // Gọi service
            PagedResponse<ProductCard> pagedResponse = productService.getProductVariantsByGenderPaged(normalizedGender, page);

            // Tạo data map
            Map<String, Object> data = new HashMap<>();
            data.put("items", pagedResponse.getContent());
            data.put("currentPage", pagedResponse.getPageNumber());
            data.put("totalItems", pagedResponse.getTotalItems());
            data.put("totalPages", pagedResponse.getTotalPages());

            // Trả response
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            data
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    private String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) return input;
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }

}
