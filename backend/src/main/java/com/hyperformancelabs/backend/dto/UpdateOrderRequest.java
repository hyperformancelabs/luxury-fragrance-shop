package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderRequest {
    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String shippingOption;

    private String note;

    private BigDecimal shippingFee;
} 