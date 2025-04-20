package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing materials used in perfume production.
 * Tracks inventory and details of raw materials.
 */
@Entity
@Table(name = "Material")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    private Integer materialId;
    
    @Column(name = "material_name", length = 100, nullable = false, unique = true)
    @NotBlank(message = "Material name is required")
    private String materialName;
    
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "unit", length = 20, nullable = false)
    @NotBlank(message = "Unit is required")
    private String unit;
    
    @Column(name = "quantity_in_stock", nullable = false)
    @Min(value = 0, message = "Quantity in stock must be non-negative")
    private Integer quantityInStock = 0;
    
    @Column(name = "reorder_level")
    @Min(value = 0, message = "Reorder level must be non-negative")
    private Integer reorderLevel;
    
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;
    
    @OneToMany(mappedBy = "material")
    private Set<MaterialTransaction> materialTransactions = new HashSet<>();
}