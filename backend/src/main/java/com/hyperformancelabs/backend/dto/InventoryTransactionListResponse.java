package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionListResponse {
    private List<InventoryTransactionDTO> items;
    private long totalElements;
    private int totalPages;
    private int currentPage;
} 