package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionUpdateRequest {
    private String promotionName;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private String discountType; // percentage, fixed_amount, free_shipping

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount value cannot be negative")
    private BigDecimal discountValue;

    private String status; // active, inactive, expired

    @Min(value = 0, message = "Usage limit cannot be negative")
    private Integer usageLimit;
} 