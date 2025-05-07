package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.GetAllBrand;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BrandService {
    Page<GetAllBrand> getAllBrands(int page);

    List<String> getAllBrandName();
}
