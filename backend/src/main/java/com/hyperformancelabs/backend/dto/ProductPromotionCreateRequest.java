package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductPromotionCreateRequest {
    @NotNull(message = "productVariantId cannot be null")
    private Integer productVariantId;

    private String conditionJson;

    @DecimalMin(value = "0.0", inclusive = true, message = "maxDiscountAmount cannot be negative")
    private BigDecimal maxDiscountAmount;

    private LocalDate startDate;
    private LocalDate endDate;

    private String status; // active, inactive, expired
} 