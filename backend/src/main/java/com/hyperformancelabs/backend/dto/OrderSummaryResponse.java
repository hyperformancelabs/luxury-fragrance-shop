package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderSummaryResponse {
    private Integer orderId;
    private String orderStatus;
    private LocalDateTime orderDate;
    private LocalDate estimatedDeliveryDate;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
    private String paymentStatus;
}
