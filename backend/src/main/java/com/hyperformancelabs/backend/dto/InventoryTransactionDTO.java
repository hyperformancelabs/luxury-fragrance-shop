package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionDTO {
    private Integer inventoryTransactionId;
    private Integer productVariantId;
    private String productName;
    private Integer volume;
    private Integer performedById;
    private String performedByName;
    private String transactionType;
    private LocalDateTime transactionDate;
    private Integer beforeQuantity;
    private Integer quantity;
    private Integer afterQuantity;
    private String reason;
    private String note;
    private BigDecimal costPrice;
} 