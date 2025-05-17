package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionUpdateRequest {
    private String transactionType;
    
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    private String reason;
    private String note;
    private BigDecimal costPrice;
} 