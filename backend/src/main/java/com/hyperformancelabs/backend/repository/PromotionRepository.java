package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    Page<Promotion> findByPromotionNameContainingIgnoreCase(String promotionName, Pageable pageable);

    Page<Promotion> findByStatus(String status, Pageable pageable);

    boolean existsByPromotionName(String promotionName);
}
