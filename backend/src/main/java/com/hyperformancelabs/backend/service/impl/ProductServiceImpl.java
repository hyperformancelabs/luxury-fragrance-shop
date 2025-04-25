package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl  implements ProductService {


    @Autowired
    ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
