package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.Random10Product;
import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
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
        // Các trường volume, price, discountPrice, quantityInStock, reorderLevel không còn thuộc Product
        // mà thuộc về ProductVariant. Hiển thị giá trị mặc định hoặc lấy từ variant đầu tiên nếu có
        if (!product.getProductVariants().isEmpty()) {
            ProductVariant firstVariant = product.getProductVariants().iterator().next();
            dto.setVolume(firstVariant.getVolume());
            dto.setPrice(firstVariant.getPrice());
            dto.setDiscountPrice(firstVariant.getDiscountPrice());
            dto.setQuantityInStock(firstVariant.getQuantityInStock());
            dto.setReorderLevel(firstVariant.getReorderLevel());
        } else {
            dto.setVolume(null);
            dto.setPrice(null);
            dto.setDiscountPrice(null);
            dto.setQuantityInStock(0);
            dto.setReorderLevel(null);
        }
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
                        (Integer) result[0],            // productVariant.product_variant_id
                        (String) result[1],             // p.product_name
                        (String) result[2],             // b.brand_name
                        (Integer) result[3],            // productVariant.volume
                        (BigDecimal) result[4],         // productVariant.price
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


    @Override
    public List<Random10Product> getRandom10Product() {
        // Lấy toàn bộ danh sách sản phẩm từ database
        List<Product> allProducts = productRepository.findAll();

        // Shuffle để ngẫu nhiên thứ tự
        Collections.shuffle(allProducts);

        // Lấy 10 sản phẩm đầu tiên sau khi random
        return allProducts.stream()
                .limit(10)
                .filter(product -> !product.getProductVariants().isEmpty())
                .map(product -> {
                    ProductVariant variant = product.getProductVariants().iterator().next();
                    return new Random10Product(
                            product.getProductId(),
                            product.getProductName(),
                            product.getBrand().getBrandName(),
                            variant.getVolume(),
                            variant.getPrice(),
                            product.getImageUrl()
                    );
                })
                .collect(Collectors.toList());
    }

}
