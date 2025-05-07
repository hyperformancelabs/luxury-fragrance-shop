package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterRequestDTO {
    private List<String> brands;
    private List<Integer> volumes;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Map<String, List<String>> productDetails;
}
