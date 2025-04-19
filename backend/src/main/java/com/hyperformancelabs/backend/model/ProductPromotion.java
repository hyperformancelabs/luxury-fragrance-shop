package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entity representing the association between products and promotions.
 * Allows tracking which products are included in specific promotional campaigns.
 */
@Entity
@Table(name = "ProductPromotion", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_ProductPromotion", columnNames = {"product_id", "promotion_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductPromotion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_promotion_id")
    private Integer productPromotionId;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @ManyToOne
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;
    
    @Column(name = "condition_json", columnDefinition = "NVARCHAR(MAX)")
    private String conditionJson;
    
    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = true, message = "Maximum discount amount must be non-negative")
    private BigDecimal maxDiscountAmount;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "status", length = 20, nullable = false)
    @Pattern(regexp = "^(active|inactive|expired)$", 
            message = "Status must be active, inactive, or expired")
    private String status = "active";
}