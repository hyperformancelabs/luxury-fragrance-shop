package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
    
    /**
     * Tìm tất cả chi tiết của sản phẩm
     *
     * @param productId ID của sản phẩm
     * @return Danh sách chi tiết sản phẩm
     */
    List<ProductDetail> findByProduct_ProductId(Integer productId);
    
    /**
     * Tìm tất cả chi tiết của sản phẩm với phân trang
     *
     * @param product Sản phẩm
     * @param pageable Thông tin phân trang
     * @return Trang chi tiết sản phẩm
     */
    Page<ProductDetail> findByProduct(Product product, Pageable pageable);
    
    /**
     * Tìm chi tiết sản phẩm theo ID của chi tiết và ID của sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param productDetailId ID của chi tiết sản phẩm
     * @return Optional của chi tiết sản phẩm
     */
    Optional<ProductDetail> findByProduct_ProductIdAndProductDetailId(Integer productId, Integer productDetailId);
    
    /**
     * Kiểm tra chi tiết sản phẩm tồn tại
     *
     * @param product Sản phẩm
     * @param detailName Tên thuộc tính
     * @param detailValue Giá trị thuộc tính
     * @return true nếu tồn tại, false nếu không
     */
    boolean existsByProductAndDetailNameAndDetailValue(Product product, String detailName, String detailValue);
    
    /**
     * Kiểm tra chi tiết sản phẩm tồn tại bởi tên thuộc tính
     *
     * @param product Sản phẩm
     * @param detailName Tên thuộc tính
     * @return true nếu tồn tại, false nếu không
     */
    boolean existsByProductAndDetailName(Product product, String detailName);
    
    /**
     * Tìm chi tiết sản phẩm theo tên thuộc tính
     *
     * @param product Sản phẩm
     * @param detailName Tên thuộc tính
     * @return Optional của chi tiết sản phẩm
     */
    Optional<ProductDetail> findByProductAndDetailName(Product product, String detailName);
}
