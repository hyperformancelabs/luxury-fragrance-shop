package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    Optional<ProductVariant> findByProductVariantIdAndVolume(Integer productVariantId, Integer volume);
}
