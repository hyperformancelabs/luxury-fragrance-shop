package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.EmployeePerformanceDTO;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.service.EmployeePerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeePerformanceServiceImpl implements EmployeePerformanceService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<EmployeePerformanceDTO> getTopPerformingEmployees(String startDate, String endDate, int limit) {
        // Get all active employees
        List<Employee> activeEmployees = employeeRepository.findAllActiveEmployees();
        
        // Calculate performance metrics for each employee
        List<EmployeePerformanceDTO> performanceList = new ArrayList<>();
        
        // Track max values for normalization
        int maxOrdersProcessed = 0;
        int maxInventoryOperations = 0;
        int maxCustomerSupport = 0;
        
        // First pass: collect raw metrics and find max values
        for (Employee employee : activeEmployees) {
            Integer ordersProcessed = employeeRepository.countProcessedOrdersByEmployeeInDateRange(
                    employee.getEmployeeId(), startDate, endDate);
            
            Integer inventoryOps = employeeRepository.countInventoryOperationsByEmployeeInDateRange(
                    employee.getEmployeeId(), startDate, endDate);
            
            Integer customerSupport = employeeRepository.countCustomerSupportInteractionsByEmployeeInDateRange(
                    employee.getEmployeeId(), startDate, endDate);
            
            // Handle null values
            ordersProcessed = ordersProcessed != null ? ordersProcessed : 0;
            inventoryOps = inventoryOps != null ? inventoryOps : 0;
            customerSupport = customerSupport != null ? customerSupport : 0;
            
            // Update max values
            maxOrdersProcessed = Math.max(maxOrdersProcessed, ordersProcessed);
            maxInventoryOperations = Math.max(maxInventoryOperations, inventoryOps);
            maxCustomerSupport = Math.max(maxCustomerSupport, customerSupport);
            
            // Create DTO with raw metrics (performance score will be calculated later)
            EmployeePerformanceDTO dto = new EmployeePerformanceDTO();
            dto.setEmployeeId(employee.getEmployeeId());
            dto.setFullName(employee.getFullName());
            dto.setUsername(employee.getUsername());
            dto.setProfilePictureUrl(employee.getProfilePictureUrl());
            dto.setProcessedOrdersCount(ordersProcessed);
            dto.setInventoryOperationsCount(inventoryOps);
            dto.setCustomerSupportCount(customerSupport);
            
            performanceList.add(dto);
        }
        
        // Calculate weights based on frequency (inverse frequency)
        // This gives higher weights to less common activities
        double totalActivities = maxOrdersProcessed + maxInventoryOperations + maxCustomerSupport;
        
        // Prevent division by zero
        if (totalActivities == 0) {
            return new ArrayList<>();
        }
        
        // Calculate weights (higher weight for less frequent activities)
        double w1 = maxOrdersProcessed > 0 ? (totalActivities / maxOrdersProcessed) / 3 : 0;
        double w2 = maxInventoryOperations > 0 ? (totalActivities / maxInventoryOperations) / 3 : 0;
        double w3 = maxCustomerSupport > 0 ? (totalActivities / maxCustomerSupport) / 3 : 0;
        
        // Second pass: normalize metrics and calculate performance scores
        for (EmployeePerformanceDTO dto : performanceList) {
            // Normalize metrics (0-1 scale)
            double normalizedOrders = maxOrdersProcessed > 0 
                    ? (double) dto.getProcessedOrdersCount() / maxOrdersProcessed 
                    : 0;
            
            double normalizedInventory = maxInventoryOperations > 0 
                    ? (double) dto.getInventoryOperationsCount() / maxInventoryOperations 
                    : 0;
            
            double normalizedSupport = maxCustomerSupport > 0 
                    ? (double) dto.getCustomerSupportCount() / maxCustomerSupport 
                    : 0;
            
            // Calculate weighted performance score
            double performanceScore = (w1 * normalizedOrders) + 
                                     (w2 * normalizedInventory) + 
                                     (w3 * normalizedSupport);
            
            // Set the performance score (scaled to 0-100 for better readability)
            dto.setPerformanceScore(BigDecimal.valueOf(performanceScore * 100)
                    .setScale(2, RoundingMode.HALF_UP));
        }
        
        // Sort by performance score (descending) and limit results
        return performanceList.stream()
                .sorted(Comparator.comparing(EmployeePerformanceDTO::getPerformanceScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
}
