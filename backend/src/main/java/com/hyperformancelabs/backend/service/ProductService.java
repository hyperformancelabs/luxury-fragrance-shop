package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductCard;
import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.Random10Product;
import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<ProductDTO> getAllProducts(int page);

    Page<ProductDTO> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);

    Page<ProductDTO> getProductsByBrand(String brandName, int page);

    List<TopSellingProductDTO> getTopSellingProducts(String category, int limit);

    List<Random10Product> getRandom10Product();

    List<ProductCard> getProductVariantsGroupedByProduct();

    List<ProductCard> getFlashSaleProducts();
}
