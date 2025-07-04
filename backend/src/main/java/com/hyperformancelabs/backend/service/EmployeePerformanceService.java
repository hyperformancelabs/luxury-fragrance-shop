package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.EmployeePerformanceDTO;

import java.util.List;

public interface EmployeePerformanceService {
    
    /**
     * Get top K employees based on performance metrics within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @param limit Number of top employees to retrieve (K)
     * @return List of top K employees with performance metrics
     */
    List<EmployeePerformanceDTO> getTopPerformingEmployees(String startDate, String endDate, int limit);
}
