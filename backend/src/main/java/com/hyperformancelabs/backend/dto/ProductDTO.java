package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {

    private Integer productId;

    private String brandName; // Thay vì Brand object, dùng brandId cho DTO

    @NotBlank(message = "Product name cannot be empty")
    private String productName;

    private String description;

    @NotNull(message = "Volume cannot be empty")
    @Positive(message = "Volume must be positive")
    private Integer volume;

    @NotNull(message = "Price cannot be empty")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount price cannot be negative")
    private BigDecimal discountPrice;

    @NotNull(message = "Quantity in stock cannot be empty")
    @Min(value = 0, message = "Quantity in stock cannot be negative")
    private Integer quantityInStock;

    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;

    private String imageUrl;
}
