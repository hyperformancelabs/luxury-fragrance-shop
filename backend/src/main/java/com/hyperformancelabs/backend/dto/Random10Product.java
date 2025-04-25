package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Random10Product {
    // Getters and Setters
    private Integer productId;
    private String productName;
    private String brandName;
    private Integer volume;
    private BigDecimal price;
    private String imageUrl;


}

