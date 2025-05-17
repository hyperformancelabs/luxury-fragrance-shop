package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {

    private Integer productId;

    private Integer brandId; // Brand ID for reference
    
    private String brandName; // Brand name for display

    @NotBlank(message = "Product name cannot be empty")
    private String productName;

    private String description;

    // Volume, price, and stock fields are for product variants
    // These can be null for the main product DTO
    private Integer volume;
    
    private BigDecimal price;
    
    private BigDecimal discountPrice;
    
    private Integer quantityInStock;
    
    private Integer reorderLevel;

    // For aggregate information from variants
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal minDiscountPrice;
    private BigDecimal maxDiscountPrice;
    private Integer totalInventory;
    private List<Integer> volumes;
    private Integer variantCount;

    private String imageUrl;
}
