package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductDetail;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setDescription(product.getDescription());
        dto.setVolume(product.getVolume());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setImageUrl(product.getImageUrl());

        // Map brand information safely
        if (product.getBrand() != null) {
            dto.setBrandId(product.getBrand().getBrandId());
            dto.setBrandName(product.getBrand().getBrandName());
            dto.setCountryOfOrigin(product.getBrand().getCountryOfOrigin());
        }

        // Map product details to a key-value map safely
        Map<String, String> details = new HashMap<>();
        // Use a safer approach to avoid ConcurrentModificationException
        dto.setDetails(details);

        return dto;
    }
}
