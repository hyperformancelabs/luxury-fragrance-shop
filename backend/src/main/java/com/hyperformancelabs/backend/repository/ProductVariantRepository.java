package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.ProductVariant;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer>, JpaSpecificationExecutor<ProductVariant>  {
    Optional<ProductVariant> findByProductVariantIdAndVolume(Integer productVariantId, Integer volume);
    List<ProductVariant> findByProduct_ProductId(Integer productId);

    @Query("""
        SELECT pv FROM ProductVariant pv
        WHERE pv.product.productId IN (
            SELECT pd.product.productId
            FROM ProductDetail pd
            WHERE pd.detailName = 'suitable_gender' AND pd.detailValue = :gender
        )
    """)
    List<ProductVariant> findByProductGender(@Param("gender") String gender);
}
