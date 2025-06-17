package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.OrderPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Map;

@Repository
public interface OrderPromotionRepository extends JpaRepository<OrderPromotion, Integer> {

    @Query(value = "SELECT COUNT(op.order_promotion_id) as totalOrders, SUM(o.total_amount) as revenue, SUM(op.discount_amount) as totalDiscount FROM [OrderPromotion] op JOIN [Order] o ON o.order_id = op.order_id WHERE op.promotion_id = :promotionId AND (:startDate IS NULL OR o.order_date >= :startDate) AND (:endDate IS NULL OR o.order_date < DATEADD(DAY,1,:endDate))", nativeQuery = true)
    Map<String, Object> getSalesSummary(@Param("promotionId") Integer promotionId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    long countByPromotion_PromotionId(Integer promotionId);
}
