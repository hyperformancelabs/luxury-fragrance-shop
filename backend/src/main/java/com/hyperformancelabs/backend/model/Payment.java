package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing payments made for orders.
 * Tracks payment transactions and their status.
 */
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
    @PastOrPresent(message = "Payment date must be in the past or present")
    private LocalDateTime paymentDate;
    
    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    @DecimalMin(value = "0.0", inclusive = true, message = "Amount must be non-negative")
    private BigDecimal amount;
    
    @Column(name = "payment_status", length = 20, nullable = false)
    @Pattern(regexp = "^(pending|completed|failed|refunded|cancelled)$", 
             message = "Payment status must be pending, completed, failed, refunded, or cancelled")
    private String paymentStatus = "pending";
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "transaction_id", length = 50)
    private String transactionId;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
    
    @Column(name = "currency", length = 10, nullable = false)
    private String currency = "VND";
    
    @ManyToOne
    @JoinColumn(name = "customer_payment_method_id")
    private CustomerPaymentMethod customerPaymentMethod;
}