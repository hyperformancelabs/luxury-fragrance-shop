package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailFullResponse {
    private Integer orderId;
    private String orderStatus;
    private LocalDateTime orderDate;
    private LocalDate estimatedDeliveryDate;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;

    private CustomerInfo customer;
    private List<OrderItemDetail> items;
    private ShipmentInfo shipment;
    private PaymentInfo payment;
}










