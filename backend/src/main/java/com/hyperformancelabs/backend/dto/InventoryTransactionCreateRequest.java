package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionCreateRequest {
    @NotNull(message = "Product variant ID cannot be null")
    private Integer productVariantId;
    
    @NotNull(message = "Transaction type cannot be null")
    private String transactionType;
    
    @NotNull(message = "Quantity cannot be null")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    private LocalDate transactionDate;
    
    private String reason;
    private String note;
    private BigDecimal costPrice;
} 