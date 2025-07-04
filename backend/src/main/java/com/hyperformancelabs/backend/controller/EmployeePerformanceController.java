package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.EmployeePerformanceDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.EmployeePerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

@RestController
public class EmployeePerformanceController {

    @Autowired
    private EmployeePerformanceService employeePerformanceService;

    /**
     * Get top K employees based on performance metrics within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @param limit Number of top employees to retrieve (K)
     * @return List of top K employees with performance metrics
     */
    @GetMapping("/employee-performance/top-performers")
    public ResponseEntity<ApiResponse<List<EmployeePerformanceDTO>>> getTopPerformingEmployees(
            @RequestParam String startDate,  // format: dd/MM/yyyy
            @RequestParam String endDate,    // format: dd/MM/yyyy
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            List<EmployeePerformanceDTO> topEmployees = employeePerformanceService.getTopPerformingEmployees(startDate, endDate, limit);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, 
                    ApiResponseStatus.GET_SUCCESS_MESSAGE, topEmployees)
            );
        } catch (Exception e) {
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
