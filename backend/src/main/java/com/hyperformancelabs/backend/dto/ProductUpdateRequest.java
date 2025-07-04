package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {
    
    private Integer brandId;
    
    @NotBlank(message = "Product name cannot be empty")
    private String productName;
    
    private String description;
    
    private String imageUrl;
} 