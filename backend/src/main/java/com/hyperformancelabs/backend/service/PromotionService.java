package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.PromotionDTO;
import org.springframework.data.domain.Page;

public interface PromotionService {
    Page<PromotionDTO> getAllPromotions(int page);
    PromotionDTO createPromotion(PromotionDTO promotionDTO);
    PromotionDTO updatePromotion(Integer id, PromotionDTO promotionDTO);

}
