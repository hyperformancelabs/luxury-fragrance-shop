package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPromotionDTO {
    private Integer orderPromotionId;
    private Integer orderId;
    private Integer promotionId;
    private BigDecimal discountAmount;
    private String note;

    public static OrderPromotionDTO toDTO(com.hyperformancelabs.backend.model.OrderPromotion orderPromotion) {
        return new OrderPromotionDTO(
                orderPromotion.getOrderPromotionId(),
                orderPromotion.getOrder() != null ? orderPromotion.getOrder().getOrderId() : null,
                orderPromotion.getPromotion() != null ? orderPromotion.getPromotion().getPromotionId() : null,
                orderPromotion.getDiscountAmount(),
                orderPromotion.getNote()
        );
    }
}
