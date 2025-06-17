package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Promotion;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromotionDTO {
    private Integer promotionId;
    private String promotionName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String discountType;
    private BigDecimal discountValue;
    private String status;
    private Integer usageLimit;
    private Long currentUsage;
    private Double usagePercentage;
    private Double timeProgressPercentage;

    public Promotion toEntity() {
        Promotion promotion = new Promotion();
        promotion.setPromotionId(promotionId);
        promotion.setPromotionName(promotionName);
        promotion.setDescription(description);
        promotion.setStartDate(startDate);
        promotion.setEndDate(endDate);
        promotion.setDiscountType(discountType);
        promotion.setDiscountValue(discountValue);
        promotion.setStatus(status);
        promotion.setUsageLimit(usageLimit);
        return promotion;
    }

    public static PromotionDTO toDTO(Promotion promotion) {
        PromotionDTO dto = new PromotionDTO();
        dto.setPromotionId(promotion.getPromotionId());
        dto.setPromotionName(promotion.getPromotionName());
        dto.setDescription(promotion.getDescription());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        dto.setDiscountType(promotion.getDiscountType());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setStatus(promotion.getStatus());
        dto.setUsageLimit(promotion.getUsageLimit());
        return dto;
    }

}
