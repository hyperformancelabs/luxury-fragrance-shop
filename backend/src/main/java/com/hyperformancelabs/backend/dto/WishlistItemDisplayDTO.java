package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistItemDisplayDTO {
    private Integer wishlistId;
    private Integer productId;
    private Integer productVariantId;
    private String productName;
    private String imageUrl;
    private Integer volume;
    private BigDecimal unitPrice;
    private Boolean inStock;
    private List<Integer> variantVolumes;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

}
