package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Cart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Integer cartId;
    private String status;
    private BigDecimal totalAmount;
    private List<CartItemDTO> items;

    public static CartDTO fromEntity(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getCartItems().stream().map(item -> {
            var pv = item.getProductVariant();
            return new CartItemDTO(
                    pv.getProduct().getProductId(),
                    pv.getProduct().getProductName(),
                    pv.getProduct().getBrand().getBrandName(),
                    pv.getVolume(),
                    item.getUnitPrice(),
                    item.getQuantity(),
                    item.getIsSelected()
            );
        }).collect(Collectors.toList());
        return new CartDTO(cart.getCartId(), cart.getStatus(), cart.getTotalAmount(), itemDTOs);
    }
} 