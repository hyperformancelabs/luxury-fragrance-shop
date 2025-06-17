package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.hyperformancelabs.backend.exception.ErrorMessage.*;

import java.util.List;

@RestController
@RequestMapping("/product-details")
public class ProductDetailController {

    @Autowired
    public ProductDetailService productDetailService;

    @GetMapping("/tone-scents")
    public ResponseEntity<ApiResponse<List<String>>> getAllToneScents() {
        try {
            List<String> toneScents = productDetailService.getAllToneScents();
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    toneScents
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        }
    }

    @GetMapping("/styles")
    public ResponseEntity<ApiResponse<List<String>>> getAllStyles() {
        try {
            List<String> styles = productDetailService.getAllStyles();
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    styles
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        }
    }
}