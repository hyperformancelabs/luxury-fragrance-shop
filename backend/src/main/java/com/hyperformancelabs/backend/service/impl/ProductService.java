package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.repository.impl.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Transactional
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    // Phân trang tất cả sản phẩm
    public Page<Product> getAllProducts(int page) {
        Pageable pageable = PageRequest.of(page, 25);  // Mỗi trang có 25 sản phẩm
        return productRepository.findAll(pageable);
    }

//    // Phân trang theo category
//    public Page<Product> getProductsByCategory(String categoryName, int page) {
//        Pageable pageable = PageRequest.of(page, 25);
//        return productRepository.findByProductCategory(categoryName, pageable);
//    }
//
//    // Phân trang theo season
//    public Page<Product> getProductsBySeason(String seasonName, int page) {
//        Pageable pageable = PageRequest.of(page, 25);
//        return productRepository.findByProductSeason(seasonName, pageable);
//    }

    // Phân trang theo brand
    public Page<Product> getProductsByBrand(String brandName, int page) {
        Pageable pageable = PageRequest.of(page, 25);
        return productRepository.findByBrand_BrandName(brandName, pageable);
    }

    public List<TopSellingProductDTO> getTopSellingProducts(String category, int limit) {
        List<Object[]> results = productRepository.findTop10TopSellingProducts(category);

        return results.stream()
                .map(result -> new TopSellingProductDTO(
                        (Integer) result[0],  // p.product_id
                        (String) result[1],   // p.product_name
                        (String) result[2],   // b.brand_name
                        (Integer) result[3],  // p.volume
                        (BigDecimal) result[4], // p.price
                        (String) result[5],   // p.image_url
                        (Integer) result[6]      // SUM(oi.quantity)
                ))
                .limit(limit)  // Giới hạn kết quả trả về
                .toList();
    }
}
