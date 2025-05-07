package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.GetAllBrand;
import com.hyperformancelabs.backend.repository.BrandRepository;
import com.hyperformancelabs.backend.service.BrandService;
import com.hyperformancelabs.backend.model.Brand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Autowired
    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public Page<GetAllBrand> getAllBrands(int page) {
        Pageable pageable = PageRequest.of(page, 24);
        Page<Brand> brandPage = brandRepository.findAll(pageable);

        return brandPage.map(brand -> new GetAllBrand(
                brand.getBrandId(),
                brand.getBrandName(),
                brand.getLogoUrl()
        ));
    }
    public List<String> getAllBrandName() {
        return brandRepository.findAll().stream()
                .map(Brand::getBrandName)
                .collect(Collectors.toList());
    }
}
