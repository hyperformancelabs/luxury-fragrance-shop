package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartFullResponse {
    private Integer cartId;
    private String status;
    private BigDecimal totalAmount;
    private List<CartItemResponse> items;
}
