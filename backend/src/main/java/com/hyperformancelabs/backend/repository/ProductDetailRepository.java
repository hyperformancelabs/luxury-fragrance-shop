package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
    List<ProductDetail> findByProduct_ProductId(Integer productId);
    List<ProductDetail> findByDetailNameAndDetailValue(String detailName, String detailValue);

    @Query("SELECT DISTINCT pd.detailValue FROM ProductDetail pd WHERE pd.detailName = 'tone_scent'")
    List<String> findAllToneScents();

    @Query("SELECT DISTINCT pd.detailValue FROM ProductDetail pd WHERE pd.detailName = 'style'")
    List<String> findAllStyles();

}
