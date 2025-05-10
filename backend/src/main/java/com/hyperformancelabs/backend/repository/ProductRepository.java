package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.dto.FlashSaleProductDTO;
import com.hyperformancelabs.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    // Tìm sản phẩm theo tên thương hiệu với phân trang
    Page<Product> findByBrand_BrandName(String brandName, Pageable pageable);
    
    // Tìm sản phẩm theo tên sản phẩm với phân trang
    Page<Product> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);
    
    // Tìm sản phẩm cùng thương hiệu, ngoại trừ sản phẩm hiện tại
    Page<Product> findByBrand_BrandIdAndProductIdNot(Integer brandId, Integer productId, Pageable pageable);
    
    // Lấy top sản phẩm bán chạy
    @Query(value = "SELECT p.* FROM [Product] p " +
           "JOIN [ProductVariant] pv ON p.product_id = pv.product_id " +
           "JOIN [OrderItem] oi ON pv.product_variant_id = oi.product_variant_id " +
           "GROUP BY p.product_id, p.brand_id, p.product_name, p.description, p.image_url " +
           "ORDER BY SUM(oi.quantity) DESC", 
           nativeQuery = true)
    List<Product> findTopSellingProducts(Pageable pageable);
    
    default List<Product> findTopSellingProducts(int limit) {
        return findTopSellingProducts(PageRequest.of(0, limit));
    }

    // Lấy danh sách sản phẩm đang trong flash sale
    @Query(value = "SELECT p.product_id, p.product_name, " +
            "pp.product_promotion_id, pp.max_discount_amount, pp.condition_json, " +
            "pr.promotion_name, pr.discount_type, pr.discount_value, pr.usage_limit, " +
            "pp.start_date, pp.end_date " +
            "FROM ProductPromotion pp " +
            "JOIN Product p ON pp.product_id = p.product_id " +
            "JOIN Promotion pr ON pp.promotion_id = pr.promotion_id " +
            "WHERE pp.status = 'active' " +
            "AND GETDATE() BETWEEN pp.start_date AND ISNULL(pp.end_date, '9999-12-31') " +
            "AND pr.status = 'active'",
            nativeQuery = true)
    List<Object[]> findActiveFlashSaleProducts();

    // Lọc sản phẩm
    @Query(value = """
    SELECT DISTINCT p.*
    FROM Product p
    JOIN Brand b ON p.brand_id = b.brand_id
    LEFT JOIN ProductDetail pd ON p.product_id = pd.product_id
    LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
    WHERE 
        (:genderList IS NULL OR (
            pd.detail_name = 'suitable_gender' AND 
            EXISTS (
                SELECT 1 FROM STRING_SPLIT(:genderList, ',') s 
                WHERE LTRIM(RTRIM(s.value)) = pd.detail_value
            )
        ))
        AND (:brandList IS NULL OR EXISTS (
            SELECT 1 FROM STRING_SPLIT(:brandList, ',') s 
            WHERE LTRIM(RTRIM(s.value)) = b.brand_name
        ))
        AND ((:minPrice IS NULL OR :maxPrice IS NULL) 
             OR pv.price BETWEEN :minPrice AND :maxPrice)
        AND (:seasonList IS NULL OR EXISTS (
            SELECT 1 FROM STRING_SPLIT(:seasonList, ',') s 
            WHERE p.description LIKE '%' + LTRIM(RTRIM(s.value)) + '%'
        ))
    ORDER BY p.product_id
    """,
            countQuery = """
    SELECT COUNT(DISTINCT p.product_id)
    FROM Product p
    JOIN Brand b ON p.brand_id = b.brand_id
    LEFT JOIN ProductDetail pd ON p.product_id = pd.product_id
    LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
    WHERE 
        (:genderList IS NULL OR (
            pd.detail_name = 'suitable_gender' AND 
            EXISTS (
                SELECT 1 FROM STRING_SPLIT(:genderList, ',') s 
                WHERE LTRIM(RTRIM(s.value)) = pd.detail_value
            )
        ))
        AND (:brandList IS NULL OR EXISTS (
            SELECT 1 FROM STRING_SPLIT(:brandList, ',') s 
            WHERE LTRIM(RTRIM(s.value)) = b.brand_name
        ))
        AND ((:minPrice IS NULL OR :maxPrice IS NULL) 
             OR pv.price BETWEEN :minPrice AND :maxPrice)
        AND (:seasonList IS NULL OR EXISTS (
            SELECT 1 FROM STRING_SPLIT(:seasonList, ',') s 
            WHERE p.description LIKE '%' + LTRIM(RTRIM(s.value)) + '%'
        ))
    """,
            nativeQuery = true)
    Page<Product> findFilteredProducts(
            @Param("genderList") String genderList,
            @Param("brandList") String brandList,
            @Param("seasonList") String seasonList,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

}
