package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Chuyển từ Product sang ProductDTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setBrandName(product.getBrand().getBrandName());
        dto.setProductName(product.getProductName());
        dto.setDescription(product.getDescription());
        dto.setVolume(product.getVolume());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setQuantityInStock(product.getQuantityInStock());
        dto.setReorderLevel(product.getReorderLevel());
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }

    // Phân trang tất cả sản phẩm
    @Override
    public Page<ProductDTO> getAllProducts(int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertToDTO);
    }

    // Phân trang theo brand
    @Override
    public Page<ProductDTO> getProductsByBrand(String brandName, int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Product> productPage = productRepository.findByBrand_BrandName(brandName, pageable);
        return productPage.map(this::convertToDTO);
    }

    // Sản phẩm bán chạy nhất (có thông tin số lượng đã bán)
    @Override
    public List<TopSellingProductDTO> getTopSellingProducts(String category, int limit) {
        List<Object[]> results = productRepository.findTop10TopSellingProducts(category);
        return results.stream()
                .map(result -> new TopSellingProductDTO(
                        (Integer) result[0],            // p.product_id
                        (String) result[1],             // p.product_name
                        (String) result[2],             // b.brand_name
                        (Integer) result[3],            // p.volume
                        (BigDecimal) result[4],         // p.price
                        (String) result[5],             // p.image_url
                        ((Number) result[6]).intValue() // SUM(oi.quantity)
                ))
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Tìm sản phẩm theo tên (phân trang)
    @Override
    public Page<ProductDTO> findByProductNameContainingIgnoreCase(String productName, Pageable pageable) {
        Page<Product> productPage = productRepository.findByProductNameContainingIgnoreCase(productName, pageable);
        return productPage.map(this::convertToDTO);
    }
}
