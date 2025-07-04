package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderListResponse {
    private List<OrderDTO> orders;
    private long totalItems;
    private int totalPages;
    private int currentPage;
} 