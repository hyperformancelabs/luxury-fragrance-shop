package com.hyperformancelabs.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShipmentInfo {
    private String provider;
    private String trackingNumber;
    private String shipmentStatus;
    private LocalDate shippingDate;
    private LocalDate deliveryDate;
    private BigDecimal shippingCost;
}
