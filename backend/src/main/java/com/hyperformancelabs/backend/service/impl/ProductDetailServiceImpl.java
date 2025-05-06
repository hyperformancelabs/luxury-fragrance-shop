package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.repository.ProductDetailRepository;
import com.hyperformancelabs.backend.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductDetailServiceImpl implements ProductDetailService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public List<String> getAllToneScents() {
        return productDetailRepository.findAllToneScents();
    }

    @Override
    public List<String> getAllStyles() {
        return productDetailRepository.findAllStyles();
    }
}
