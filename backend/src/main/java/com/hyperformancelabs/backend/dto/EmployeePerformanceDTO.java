package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeePerformanceDTO {
    private Integer employeeId;
    private String fullName;
    private String username;
    private String profilePictureUrl;
    private Integer processedOrdersCount;
    private Integer inventoryOperationsCount;
    private Integer customerSupportCount;
    private BigDecimal performanceScore;
}
