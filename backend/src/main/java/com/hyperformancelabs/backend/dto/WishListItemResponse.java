package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishListItemResponse {
    private Integer wishlistId;
    private Integer productVariantId;
    private String productName;
    private Integer volume;
    private BigDecimal price;
    private String brandName;
    private String imageUrl;
    private String countryOfOrigin;
}
