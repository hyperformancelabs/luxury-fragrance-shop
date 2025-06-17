package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.ProductPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, Integer> {
    List<ProductPromotion> findByPromotion_PromotionId(Integer promotionId);

    boolean existsByPromotion_PromotionIdAndProductVariant_ProductVariantId(Integer promotionId, Integer productVariantId);
}
