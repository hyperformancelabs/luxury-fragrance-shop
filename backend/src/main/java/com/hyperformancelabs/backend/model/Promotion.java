package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing promotional campaigns in the system.
 * Stores information about discounts, special offers and marketing campaigns.
 */
@Entity
@Table(name = "Promotion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Integer promotionId;
    
    @Column(name = "promotion_name", length = 100, nullable = false)
    @NotBlank(message = "Promotion name is required")
    private String promotionName;
    
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "discount_type", length = 20, nullable = false)
    @Pattern(regexp = "^(percentage|fixed_amount|free_shipping)$", 
            message = "Discount type must be percentage, fixed_amount, or free_shipping")
    private String discountType = "percentage";
    
    @Column(name = "discount_value", precision = 10, scale = 2)
    private BigDecimal discountValue;
    
    @Column(name = "status", length = 20, nullable = false)
    @Pattern(regexp = "^(active|inactive|expired)$", 
            message = "Status must be active, inactive, or expired")
    private String status = "active";
    
    @Column(name = "usage_limit")
    @Min(value = 0, message = "Usage limit must be non-negative")
    private Integer usageLimit;
    
    @OneToMany(mappedBy = "promotion")
    private Set<ProductPromotion> productPromotions = new HashSet<>();
    
    @OneToMany(mappedBy = "promotion")
    private Set<OrderPromotion> orderPromotions = new HashSet<>();
}