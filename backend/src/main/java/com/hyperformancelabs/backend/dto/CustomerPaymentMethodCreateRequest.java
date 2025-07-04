package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPaymentMethodCreateRequest {
    @NotNull
    private Integer paymentMethodId;
    private String provider;
    private String accountNumber;
    private Boolean isDefault = false;
} 