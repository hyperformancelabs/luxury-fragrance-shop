package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;
    
    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;
    
    @Column(name = "payment_status", length = 20, nullable = false)
    private String paymentStatus = "pending";
    
    @Column(name = "transaction_id", length = 50)
    private String transactionId;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
    
    @Column(name = "currency", length = 10, nullable = false)
    private String currency = "VND";
} 