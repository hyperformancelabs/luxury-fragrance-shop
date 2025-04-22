package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartItemRequest {
    @NotNull(message = "Cart item ID is required")
    private Integer cartItemId;
    
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    private Boolean isSelected;
    
    private String note;
}
