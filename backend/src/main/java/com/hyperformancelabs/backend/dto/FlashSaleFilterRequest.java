package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashSaleFilterRequest {
    private String brand;
    private String gender;
    private String tone;
    private Integer volume;
    private Double minPrice;
    private Double maxPrice;
    // getters + setters
}

