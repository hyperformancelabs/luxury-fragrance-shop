package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCartItemRequest {

    @NotNull(message = "ProductVariantId is required")
    private Integer productVariantId;

    @Min(value = 0, message = "Quantity must be >= 0")
    private int newQuantity;
}
