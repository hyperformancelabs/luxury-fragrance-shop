package com.hyperformancelabs.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductFilterDTO {
    private List<Integer> brandIds;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<String> toneScents;
    private List<String> suitableGenders;
    private List<String> styles;
    private List<Integer> volumes;
    private List<String> countriesOfOrigin;
    
    // Pagination and sorting
    private Integer page;
    private Integer size;
    private String sortBy;
    private String sortDirection;
    
    // For keyset pagination (optional, for better performance)
    private Integer lastSeenProductId;
    private Object lastSeenValue;
}
