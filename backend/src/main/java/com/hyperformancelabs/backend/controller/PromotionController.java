package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.PromotionDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PromotionDTO>>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page) {
        try {
            Page<PromotionDTO> promotions = promotionService.getAllPromotions(page);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            promotions
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

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PromotionDTO>> createPromotion(@RequestBody PromotionDTO promotionDTO) {
        try {
            PromotionDTO createdPromotion = promotionService.createPromotion(promotionDTO);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.CREATE_SUCCESS_MESSAGE,
                            createdPromotion
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

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<PromotionDTO>> updatePromotion(@PathVariable Integer id, @RequestBody PromotionDTO promotionDTO) {
        try {
            PromotionDTO updatedPromotion = promotionService.updatePromotion(id, promotionDTO);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.UPDATE_SUCCESS_MESSAGE,
                            updatedPromotion
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
