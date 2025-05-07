package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.GetAllBrand;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllBrands(@RequestParam(defaultValue = "0") int page) {
        try {
            Page<GetAllBrand> brands = brandService.getAllBrands(page);
            
            Map<String, Object> data = new HashMap<>();
            data.put("items", brands.getContent());
            data.put("currentPage", brands.getNumber());
            data.put("totalItems", brands.getTotalElements());
            data.put("totalPages", brands.getTotalPages());
            
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

    @GetMapping("name")
    public ResponseEntity<ApiResponse<List<String>>> getAllBrandName() {
        try {
            List<String> brandName = brandService.getAllBrandName();
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    brandName
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
}