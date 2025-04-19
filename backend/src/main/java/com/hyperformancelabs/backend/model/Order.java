package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a customer order.
 * Stores order details, shipping information, and payment status.
 */
@Entity
@Table(name = "Order") // "Order" là từ khóa trong SQL, cần đặt trong dấu ngoặc vuông trong SQL Server
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @Column(name = "order_date", nullable = false)
    @PastOrPresent(message = "Order date must be in the past or present")
    private LocalDateTime orderDate = LocalDateTime.now();
    
    @Column(name = "total_amount", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = true, message = "Total amount must be non-negative")
    private BigDecimal totalAmount;
    
    @Column(name = "shipping_fee", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = true, message = "Shipping fee must be non-negative")
    private BigDecimal shippingFee;
    
    @Column(name = "order_status", length = 20, nullable = false)
    @Pattern(regexp = "^(pending|processing|shipping|delivered|cancelled)$", 
             message = "Order status must be one of pending, processing, shipping, delivered, or cancelled")
    private String orderStatus = "pending";
    
    @Column(name = "shipping_address", length = 255, nullable = false)
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    @Column(name = "shipping_option", length = 50, nullable = false)
    @NotBlank(message = "Shipping option is required")
    private String shippingOption;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
    
    @Column(name = "estimated_delivery_date")
    private LocalDate estimatedDeliveryDate;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> orderItems = new HashSet<>();
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<OrderPromotion> orderPromotions = new HashSet<>();
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<Payment> payments = new HashSet<>();
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<Shipment> shipments = new HashSet<>();
}