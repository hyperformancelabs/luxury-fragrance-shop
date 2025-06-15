package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShipmentRequest {
    private String shippingProvider;
    private String trackingNumber;
    private String shipmentStatus; // pending, in_transit, delivered, failed
    private BigDecimal shippingCost;
    private LocalDate shippingDate;
    private LocalDate estimatedDeliveryDate;
    private LocalDate deliveryDate;
} 