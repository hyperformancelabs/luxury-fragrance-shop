package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

/**
 * Entity representing the association between orders and promotions.
 * Tracks which promotional discounts were applied to specific orders.
 */
@Entity
@Table(name = "OrderPromotion", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_OrderPromotion", columnNames = {"order_id", "promotion_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPromotion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_promotion_id")
    private Integer orderPromotionId;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;
    
    @Column(name = "discount_amount", precision = 10, scale = 2, nullable = false)
    @DecimalMin(value = "0.0", inclusive = true, message = "Discount amount must be non-negative")
    private BigDecimal discountAmount;
    
    @Column(name = "condition_json", columnDefinition = "NVARCHAR(MAX)")
    private String conditionJson;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
}