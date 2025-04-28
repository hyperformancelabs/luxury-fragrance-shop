package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.SellTransactionSummaryDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.impl.InventoryTransactionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/sell-transactions/summary/today")
    public ResponseEntity<ApiResponse<SellTransactionSummaryDTO>> getSellTransactionSummaryInToday() {
        try {
            SellTransactionSummaryDTO summary = inventoryTransactionService.getSellTransactionSummaryInToday();
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

    @GetMapping("/sell-transactions/summary/week")
    public ResponseEntity<ApiResponse<SellTransactionSummaryDTO>> getSellTransactionSummaryInCurrentWeek() {
        try {
            SellTransactionSummaryDTO summary = inventoryTransactionService.getSellTransactionSummaryInCurrentWeek();
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

    @GetMapping("/sell-transactions/summary/month")
    public ResponseEntity<ApiResponse<SellTransactionSummaryDTO>> getSellTransactionSummaryInCurrentMonth() {
        try {
            SellTransactionSummaryDTO summary = inventoryTransactionService.getSellTransactionSummaryInCurrentMonth();
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

    @GetMapping("/sell-transactions/summary/year")
    public ResponseEntity<ApiResponse<SellTransactionSummaryDTO>> getSellTransactionSummaryInCurrentYear() {
        try {
            SellTransactionSummaryDTO summary = inventoryTransactionService.getSellTransactionSummaryInCurrentYear();
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

    @GetMapping("/sell-transactions/summary/date-range")
    public ResponseEntity<ApiResponse<SellTransactionSummaryDTO>> getSellTransactionSummaryByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        try {
        SellTransactionSummaryDTO summary = inventoryTransactionService.getSellTransactionSummaryByDateRange(startDate, endDate);
        return ResponseEntity.ok(
                new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, summary)
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

    @GetMapping("/sell-transactions/summary/quarter-and-year")
    public ResponseEntity<ApiResponse<SellTransactionSummaryDTO>> getSellTransactionSummaryByQuarterAndYear(
            @RequestParam int quarter,
            @RequestParam int year
    ) {
        try {
            SellTransactionSummaryDTO summary = inventoryTransactionService.getSellTransactionSummaryByQuarterAndYear(quarter, year);
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
