package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Integer cartItemId;
    
    @NotNull(message = "Product ID is required")
    private Integer productId;
    
    private String productName;
    private String productImage;
    private Integer volume;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String note;
    private Boolean isSelected = true;
}
