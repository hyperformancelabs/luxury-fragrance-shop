package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.GetAllBrand;
import org.springframework.data.domain.Page;

public interface BrandService {
    Page<GetAllBrand> getAllBrands(int page);
}
