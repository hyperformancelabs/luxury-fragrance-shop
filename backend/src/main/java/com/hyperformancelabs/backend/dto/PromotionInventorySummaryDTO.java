package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionInventorySummaryDTO {
    private int totalProducts;
    private int totalVariants;
    private int totalInventory;
    private int outOfStockProducts;
} 