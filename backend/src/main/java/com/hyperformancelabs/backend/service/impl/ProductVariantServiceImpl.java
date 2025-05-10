package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductVariantDTO;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Override
    public List<ProductVariantDTO> getProductVariantsByProductId(Integer productId) {
        return productVariantRepository.findByProduct_ProductId(productId)
                .stream()
                .map(this::convertToProductVariantDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductVariantDTO getProductVariantById(Integer productVariantId) {
        return productVariantRepository.findById(productVariantId)
                .map(this::convertToProductVariantDTO)
                .orElse(null);
    }

    @Override
    public ProductVariantDTO findFirstByProduct_ProductId(Integer productId) {
        List<ProductVariantDTO> variants = getProductVariantsByProductId(productId);
        return variants.isEmpty() ? null : variants.get(0);
    }

    @Override
    public List<Object[]> getMinAndMaxVariantPrice(){
        return productVariantRepository.findMinAndMaxVariantPrice();
    }

    private ProductVariantDTO convertToProductVariantDTO(ProductVariant productVariant) {
        return new ProductVariantDTO(
                productVariant.getProductVariantId(),
                productVariant.getProduct().getProductId(),
                productVariant.getVolume(),
                productVariant.getPrice(),
                productVariant.getDiscountPrice(),
                productVariant.getQuantityInStock(),
                productVariant.getReorderLevel()
        );
    }
}
