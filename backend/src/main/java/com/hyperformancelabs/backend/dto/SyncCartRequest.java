package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SyncCartRequest {

    @NotNull
    private List<CartItemData> cartItems;

    @Data
    public static class CartItemData {
        @NotNull
        private Integer productVariantId;

        @Min(1)
        private int quantity;

        private String note;
    }
}
