package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Integer productId;
    private String productName;
    private String brandName;
    private Integer volume;
    private BigDecimal unitPrice;
    private Integer quantity;
    private Boolean isSelected;
}
