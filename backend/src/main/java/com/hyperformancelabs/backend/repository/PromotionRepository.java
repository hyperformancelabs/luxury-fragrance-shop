package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    Page<Promotion> findByPromotionNameContainingIgnoreCase(String promotionName, Pageable pageable);

    Page<Promotion> findByStatus(String status, Pageable pageable);

    boolean existsByPromotionName(String promotionName);

    /* Fetch promotions that will start in the future sorted by startDate ASC */
    List<Promotion> findByStartDateAfterOrderByStartDateAsc(LocalDate date);

    /* Fetch promotions with status = 'active' that are not expired (end_date null or >= today) ordered by start_date ASC */
    @Query("SELECT p FROM Promotion p WHERE p.status = 'active' AND (p.endDate IS NULL OR p.endDate >= :date) ORDER BY p.startDate ASC")
    List<Promotion> findActiveAndNotExpired(@Param("date") LocalDate date);
}
