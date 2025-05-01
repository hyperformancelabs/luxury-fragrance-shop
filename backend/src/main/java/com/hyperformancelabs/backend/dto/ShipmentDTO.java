package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentDTO {
    private Integer shipmentId;
    private Integer orderId;
    private String shippingProvider;
    private String trackingNumber;
    private String shipmentStatus;
    private BigDecimal shippingCost;
    private LocalDate shippingDate;
    private LocalDate estimatedDeliveryDate;
    private LocalDate deliveryDate;

    public static ShipmentDTO toDTO(com.hyperformancelabs.backend.model.Shipment shipment) {
        return new ShipmentDTO(
                shipment.getShipmentId(),
                shipment.getOrder() != null ? shipment.getOrder().getOrderId() : null,
                shipment.getShippingProvider(),
                shipment.getTrackingNumber(),
                shipment.getShipmentStatus(),
                shipment.getShippingCost(),
                shipment.getShippingDate(),
                shipment.getEstimatedDeliveryDate(),
                shipment.getDeliveryDate()
        );
    }
}
