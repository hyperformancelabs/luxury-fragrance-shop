package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {
    private String productName;
    private String volume;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String imageUrl;
    private String note;
}
