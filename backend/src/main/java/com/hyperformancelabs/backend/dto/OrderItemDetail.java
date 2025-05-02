package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDetail {
    private String productName;
    private String volume;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String note;
}
