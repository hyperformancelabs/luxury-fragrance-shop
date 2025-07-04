package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialCreateRequest {
    @NotBlank(message = "Material name cannot be empty")
    private String materialName;
    
    private String description;
    
    @NotBlank(message = "Unit cannot be empty")
    private String unit;
    
    @NotNull(message = "Quantity in stock cannot be empty")
    @Min(value = 0, message = "Quantity in stock cannot be negative")
    private Integer quantityInStock;
    
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;
    
    @NotNull(message = "Price cannot be empty")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;
} 