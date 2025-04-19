package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing material transactions in the system.
 * Tracks all material movement including purchases, adjustments, and usage.
 */
@Entity
@Table(name = "MaterialTransaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_transaction_id")
    private Integer materialTransactionId;
    
    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;
    
    @ManyToOne
    @JoinColumn(name = "performed_by", nullable = false)
    private Employee performedBy;
    
    @Column(name = "transaction_date", nullable = false)
    @PastOrPresent(message = "Transaction date must be in the past or present")
    private LocalDateTime transactionDate;
    
    @Column(name = "before_quantity")
    @Min(value = 0, message = "Before quantity must be non-negative")
    private Integer beforeQuantity;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "after_quantity")
    @Min(value = 0, message = "After quantity must be non-negative")
    private Integer afterQuantity;
    
    @Column(name = "transaction_type", length = 20, nullable = false)
    @Pattern(regexp = "^(import|export|adjust)$", message = "Transaction type must be import, export, or adjust")
    private String transactionType;
    
    @Column(name = "reason", columnDefinition = "NVARCHAR(MAX)")
    private String reason;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
    
    @Column(name = "cost_price", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be non-negative")
    private BigDecimal costPrice;
}