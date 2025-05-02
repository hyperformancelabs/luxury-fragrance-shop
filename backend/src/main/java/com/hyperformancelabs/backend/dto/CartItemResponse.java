package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private Integer cartItemId;
    private Integer productVariantId;
    private String productName;
    private Integer volume;
    private BigDecimal unitPrice;
    private Integer quantity;
    private String note;

    private String brandName;
    private String countryOfOrigin;
    private String imageUrl;
}
