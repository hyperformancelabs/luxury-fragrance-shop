package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    private String shipmentStatus = "pending";
    
    @Column(name = "shipping_cost", precision = 10, scale = 2)
    private BigDecimal shippingCost;
    
    @Column(name = "shipping_date")
    private LocalDate shippingDate;
    
    @Column(name = "estimated_delivery_date")
    private LocalDate estimatedDeliveryDate;
    
    @Column(name = "delivery_date")
    private LocalDate deliveryDate;
} 