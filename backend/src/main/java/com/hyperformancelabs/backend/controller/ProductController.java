package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.impl.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // API lấy tất cả sản phẩm với phân trang
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProducts(@RequestParam(defaultValue = "0") int page) {
        try {
            Page<Product> products = productService.getAllProducts(page);

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

    // API lấy sản phẩm theo brand với phân trang
    @GetMapping("/brand/{brandName}")
    public ResponseEntity<ApiResponse<Page<Product>>> getProductsByBrand(
            @PathVariable String brandName,
            @RequestParam(defaultValue = "0") int page) {
        try {
            Page<Product> products = productService.getProductsByBrand(brandName, page);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    products
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

    //    // API lấy sản phẩm theo category với phân trang
//    @GetMapping("/category/{categoryName}")
//    public ResponseEntity<Page<Product>> getProductsByCategory(
//            @PathVariable String categoryName,
//            @RequestParam(defaultValue = "0") int page) {
//        Page<Product> products = productService.getProductsByCategory(categoryName, page);
//        return ResponseEntity.ok(products);
//    }
//
//    // API lấy sản phẩm theo season với phân trang
//    @GetMapping("/season/{seasonName}")
//    public ResponseEntity<Page<Product>> getProductsBySeason(
//            @PathVariable String seasonName,
//            @RequestParam(defaultValue = "0") int page) {
//        Page<Product> products = productService.getProductsBySeason(seasonName, page);
//        return ResponseEntity.ok(products);
//    }
}
