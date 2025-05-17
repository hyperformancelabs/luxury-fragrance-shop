package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductVariant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    
    /**
     * Tìm tất cả các biến thể của sản phẩm với phân trang
     *
     * @param product   Sản phẩm
     * @param pageable  Thông tin phân trang
     * @return          Danh sách biến thể có phân trang
     */
    Page<ProductVariant> findByProduct(Product product, Pageable pageable);
    
    /**
     * Tìm biến thể theo productId và variantId
     *
     * @param product       Sản phẩm
     * @param variantId     ID của biến thể
     * @return              Optional của biến thể nếu tìm thấy
     */
    Optional<ProductVariant> findByProductAndProductVariantId(Product product, Integer variantId);
    
    /**
     * Kiểm tra biến thể tồn tại bởi sản phẩm, thể tích
     *
     * @param product   Sản phẩm
     * @param volume    Thể tích
     * @return          true nếu tồn tại, false nếu không
     */
    boolean existsByProductAndVolume(Product product, Integer volume);
    
    /**
     * Tìm biến thể theo sản phẩm và thể tích
     *
     * @param product   Sản phẩm
     * @param volume    Thể tích
     * @return          Optional của biến thể nếu tìm thấy
     */
    Optional<ProductVariant> findByProductAndVolume(Product product, Integer volume);
} 