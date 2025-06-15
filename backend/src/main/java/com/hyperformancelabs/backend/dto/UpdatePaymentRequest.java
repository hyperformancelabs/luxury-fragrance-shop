package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentRequest {
    private Integer paymentMethodId;
    private BigDecimal amount;
    private String paymentStatus; // pending, completed, failed, refunded
    private String transactionId;
    private String note;
    private String currency;
    private LocalDateTime paymentDate;
} 