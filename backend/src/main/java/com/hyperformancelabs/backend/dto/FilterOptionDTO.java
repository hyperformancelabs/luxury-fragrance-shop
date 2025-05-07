package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterOptionDTO {
    private List<String> brands;
    private List<Integer> volumes;
    private Map<String, List<String>> productDetails;
    private Map<String, Object> priceRange;
}
