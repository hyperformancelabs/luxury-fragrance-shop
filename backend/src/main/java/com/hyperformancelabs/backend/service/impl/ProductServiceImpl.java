package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::convertToProductDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByBrandName(String brandName, Pageable pageable) {
        return productRepository.findByBrand_BrandName(brandName, pageable).map(this::convertToProductDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByProductName(String productName, Pageable pageable) {
        return productRepository.findByProductNameContainingIgnoreCase(productName, pageable).map(this::convertToProductDTO);
    }
    
    @Override
    public ProductDTO getProductById(Integer productId) {
        Optional<Product> productOptional = productRepository.findById(productId);
        return productOptional.map(this::convertToProductDTO).orElse(null);
    }
    
    @Override
    public List<ProductDTO> getRelatedProducts(Integer productId, int limit) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return List.of();
        }
        
        // Lấy sản phẩm cùng thương hiệu, ngoại trừ sản phẩm hiện tại
        return productRepository.findByBrand_BrandIdAndProductIdNot(
                product.getBrand().getBrandId(), 
                productId, 
                PageRequest.of(0, limit)
            ).stream()
            .map(this::convertToProductDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductDTO> getTopSellingProducts(int limit) {
        // Giả sử có phương thức trong repository để lấy top sản phẩm bán chạy
        return productRepository.findTopSellingProducts(limit)
                .stream()
                .map(this::convertToProductDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToProductDTO(Product product) {
        return new ProductDTO(
                product.getProductId(),
                product.getBrand().getBrandId(),
                product.getProductName(),
                product.getDescription(),
                product.getImageUrl()
        );
    }
}