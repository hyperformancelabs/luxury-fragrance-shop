package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Integer paymentId;
    private Integer orderId;
    private LocalDateTime paymentDate;
    private BigDecimal amount;
    private String paymentStatus;
    private String transactionId;
    private String note;
    private String currency;

    public static PaymentDTO toDTO(com.hyperformancelabs.backend.model.Payment payment) {
        return new PaymentDTO(
                payment.getPaymentId(),
                payment.getOrder() != null ? payment.getOrder().getOrderId() : null,
                payment.getPaymentDate(),
                payment.getAmount(),
                payment.getPaymentStatus(),
                payment.getTransactionId(),
                payment.getNote(),
                payment.getCurrency()
        );
    }
}
