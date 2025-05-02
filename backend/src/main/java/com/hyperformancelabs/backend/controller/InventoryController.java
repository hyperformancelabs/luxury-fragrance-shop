package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.LowStockProductDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    /**
     * Get products with low stock levels (below or equal to reorder level)
     * @param limit Number of products to return (default: 10)
     * @return List of products with low stock levels, sorted by stock level (ascending)
     */
    @GetMapping("/low-stock-alerts")
    public ResponseEntity<ApiResponse<List<LowStockProductDTO>>> getLowStockAlerts(
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            List<LowStockProductDTO> lowStockProducts = inventoryService.getLowStockProducts(limit);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            lowStockProducts
                    )
            );
        } catch (Exception e) {
            // Convert stack trace to string for detailed error reporting
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String stackTrace = sw.toString();
            
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            "Error: " + e.getMessage() + "\nStack trace: " + stackTrace,
                            null
                    )
            );
        }
    }
}
