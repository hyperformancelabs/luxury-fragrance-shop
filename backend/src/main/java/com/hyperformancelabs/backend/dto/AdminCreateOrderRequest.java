package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminCreateOrderRequest {
    @NotNull
    private Integer customerId;

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String shippingOption;

    private String note;

    private BigDecimal shippingFee = BigDecimal.ZERO;

    @NotNull
    private List<OrderItemRequest> items;

} 