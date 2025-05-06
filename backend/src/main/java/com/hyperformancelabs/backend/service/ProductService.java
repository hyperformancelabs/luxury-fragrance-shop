package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.payload.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    Page<ProductDTO> getAllProducts(int page);

    Page<ProductDTO> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);

    Page<ProductDTO> getProductsByBrand(String brandName, int page);

    List<TopSellingProductDTO> getTopSellingProducts(String category, int limit);

    List<Random10Product> getRandom10Product();

    List<ProductCard> getProductVariantsGroupedByProduct();

//    List<ProductCard> getFlashSaleProducts();

    List<ProductCard> getFilteredFlashSaleProducts(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer volume,
            String brandName,
            String suitableGender,
            String style,
            String toneScent
    );
    PagedResponse<ProductCard> getProductVariantsByBrandNamePaged(String brandName, int pageNumber);

    ProductDetailDTO getProductDetailById(Integer productId);

    PagedResponse<ProductCard> getProductVariantsByGenderPaged(String gender, int pageNumber);
    }
