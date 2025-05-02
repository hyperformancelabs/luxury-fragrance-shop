package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemRequest {
    private Integer productVariantId; // đổi thành productVariantId
    private Integer quantity;
    private BigDecimal price;

}
