package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialUpdateRequest {
    @NotBlank(message = "Material name cannot be empty")
    private String materialName;
    
    private String description;
    
    @NotBlank(message = "Unit cannot be empty")
    private String unit;
    
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;
} 