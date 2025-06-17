package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionSalesSummaryDTO {
    private Integer promotionId;
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalOrders;
    private BigDecimal grossRevenue; // sum of order total_amount
    private BigDecimal totalDiscount;
} 