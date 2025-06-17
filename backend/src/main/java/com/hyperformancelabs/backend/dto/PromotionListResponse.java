package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionListResponse {
    private List<PromotionDTO> promotions;
    private long totalElements;
    private int totalPages;
    private int currentPage;
} 