package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductVariantDTO;
import com.hyperformancelabs.backend.model.ProductVariant;

import java.util.List;

public interface ProductVariantService {
    // Tìm tất cả biến thể của một sản phẩm
    List<ProductVariantDTO> findByProduct_ProductId(Integer productId);

    // Tìm biến thể theo ID
    ProductVariantDTO findByProductVariantId(Integer productVariantId);
}
