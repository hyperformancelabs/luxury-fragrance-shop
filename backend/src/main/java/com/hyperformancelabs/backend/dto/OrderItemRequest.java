package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemRequest {

    @NotNull(message = "Product variant ID cannot be empty")
    private Integer productVariantId;

    @NotNull(message = "Quantity cannot be empty")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

//    private String imageUrl;

    @NotNull(message = "Unit price cannot be empty")
    @DecimalMin(value = "0.0", inclusive = true, message = "Unit price cannot be negative")
    private BigDecimal unitPrice;

    private String note;
}
