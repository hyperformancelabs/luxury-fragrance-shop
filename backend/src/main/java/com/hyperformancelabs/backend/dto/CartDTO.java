package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Integer cartId;
    private Integer customerId;
    private String customerName;
    private String sessionId;
    private String status;
    private BigDecimal totalAmount;
    private Integer itemCount;
    private List<CartItemDTO> items = new ArrayList<>();
}
