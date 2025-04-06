package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private LocalDateTime transactionDate;
    
    @Column(name = "before_quantity")
    private Integer beforeQuantity;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "after_quantity")
    private Integer afterQuantity;
    
    @Column(name = "transaction_type", length = 20, nullable = false)
    private String transactionType;
    
    @Column(name = "reason", columnDefinition = "NVARCHAR(MAX)")
    private String reason;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
    
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
} 