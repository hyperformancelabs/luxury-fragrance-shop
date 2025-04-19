package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entity representing shipment information for orders.
 * Tracks shipping details, status, and delivery dates.
 */
@Entity
@Table(name = "Shipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_id")
    private Integer shipmentId;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(name = "shipping_provider", length = 50)
    private String shippingProvider;
    
    @Column(name = "tracking_number", length = 50)
    private String trackingNumber;
    
    @Column(name = "shipment_status", length = 20, nullable = false)
    @Pattern(regexp = "^(pending|in_transit|delivered|failed)$", 
             message = "Shipment status must be pending, in_transit, delivered, or failed")
    private String shipmentStatus = "pending";
    
    @Column(name = "shipping_cost", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = true, message = "Shipping cost must be non-negative")
    private BigDecimal shippingCost;
    
    @Column(name = "shipping_date")
    private LocalDate shippingDate;
    
    @Column(name = "estimated_delivery_date")
    private LocalDate estimatedDeliveryDate;
    
    @Column(name = "delivery_date")
    private LocalDate deliveryDate;
}