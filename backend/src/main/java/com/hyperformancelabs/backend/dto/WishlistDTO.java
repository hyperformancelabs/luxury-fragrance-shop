package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Wishlist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDTO {
    private Integer wishlistId;
    private Integer productId;
    private String productName;
    private String brandName;
    private Integer volume;
    private java.time.LocalDateTime addedDate;

    public static WishlistDTO fromEntity(Wishlist w) {
        var pv = w.getProductVariant();
        return new WishlistDTO(
                w.getWishlistId(),
                pv.getProduct().getProductId(),
                pv.getProduct().getProductName(),
                pv.getProduct().getBrand().getBrandName(),
                pv.getVolume(),
                w.getAddedDate()
        );
    }
} 