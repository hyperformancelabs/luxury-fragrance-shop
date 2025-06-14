package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialListResponse {
    private List<MaterialDTO> materials;
    private long totalElements;
    private int totalPages;
    private int currentPage;
} 