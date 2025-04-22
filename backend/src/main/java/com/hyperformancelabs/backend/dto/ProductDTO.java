package com.hyperformancelabs.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class ProductDTO {
    private Integer productId;
    private String productName;
    private String description;
    private Integer brandId;
    private String brandName;
    private String countryOfOrigin;
    private Integer volume;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String imageUrl;
    private Map<String, String> details; // Store product details as key-value pairs
}
