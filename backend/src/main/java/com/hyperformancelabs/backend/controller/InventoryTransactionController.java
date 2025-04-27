package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.SellTransactionSummaryDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.impl.InventoryTransactionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory-transactions")
public class InventoryTransactionController {

    @Autowired
    private InventoryTransactionServiceImpl inventoryTransactionService;

    @GetMapping("/sell-transactions/summary")
    public ResponseEntity<ApiResponse<SellTransactionSummaryDTO>> getSellTransactionSummary() {
        try {
            SellTransactionSummaryDTO summary = inventoryTransactionService.getSellTransactionSummary();
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            summary
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
