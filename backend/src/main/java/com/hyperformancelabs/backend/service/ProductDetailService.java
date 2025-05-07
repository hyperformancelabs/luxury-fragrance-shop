package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.FilterOptionDTO;

import java.util.List;

public interface ProductDetailService {

    List<String> getAllToneScents();

    List<String> getAllStyles();
    
    FilterOptionDTO getFilterOptions();
}
