package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.dto.ProductCard;
import com.hyperformancelabs.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
//    // Tìm kiếm sản phẩm theo category với phân trang
//    Page<Product> findByProductCategory(String categoryName, Pageable pageable);
//
//    // Tìm kiếm sản phẩm theo season với phân trang
//    Page<Product> findByProductSeason(String seasonName, Pageable pageable);

    // Tìm kiếm sản phẩm theo brand với phân trang
    Page<Product> findByBrand_BrandName(String brandName, Pageable pageable);

    Page<Product> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);

    @Query(value = """
    SELECT pv.product_variant_id, p.product_name, b.brand_name, pv.volume, pv.price, p.image_url, SUM(oi.quantity)
    FROM [OrderItem] oi
    JOIN [ProductVariant] pv ON pv.product_variant_id = oi.product_variant_id
    JOIN [Product] p ON p.product_id = pv.product_id
    JOIN [Brand] b ON b.brand_id = p.brand_id
    JOIN [Order] o ON o.order_id = oi.order_id
    LEFT JOIN [ProductDetail] pd ON p.product_id = pd.product_id AND pd.detail_name = 'suitable_gender'
    WHERE o.order_status = 'delivered'
      AND (:category IS NULL OR pd.detail_value = :category)
    GROUP BY pv.product_variant_id, p.product_name, b.brand_name, pv.volume, pv.price, p.image_url
    ORDER BY SUM(oi.quantity) DESC
    """, nativeQuery = true)
    List<Object[]> findTop10TopSellingProducts(@Param("category") String category);

    @Query(value = "SELECT p FROM Product p LEFT JOIN FETCH p.productVariants WHERE p.productId BETWEEN 1 AND 10")
    List<Product> findFlashSaleProducts();



}
