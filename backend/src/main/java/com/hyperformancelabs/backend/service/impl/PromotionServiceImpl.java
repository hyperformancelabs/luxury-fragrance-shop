package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.PromotionDTO;
import com.hyperformancelabs.backend.model.Promotion;
import com.hyperformancelabs.backend.repository.PromotionRepository;
import com.hyperformancelabs.backend.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class PromotionServiceImpl implements PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    @Override
    public Page<PromotionDTO> getAllPromotions(int page) {
        Page<Promotion> promotionPage = promotionRepository.findAll(PageRequest.of(page, 25));
        return promotionPage.map(PromotionDTO::toDTO);
    }

    @Override
    public PromotionDTO createPromotion(PromotionDTO promotionDTO) {
        Promotion promotion = promotionDTO.toEntity();
        promotion = promotionRepository.save(promotion);
        return PromotionDTO.toDTO(promotion);
    }

    @Override
    public PromotionDTO updatePromotion(Integer id, PromotionDTO promotionDTO) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        promotion.setPromotionName(promotionDTO.getPromotionName());
        promotion.setDescription(promotionDTO.getDescription());
        promotion.setStartDate(promotionDTO.getStartDate());
        promotion.setEndDate(promotionDTO.getEndDate());
        promotion.setDiscountType(promotionDTO.getDiscountType());
        promotion.setDiscountValue(promotionDTO.getDiscountValue());
        promotion.setStatus(promotionDTO.getStatus());
        promotion.setUsageLimit(promotionDTO.getUsageLimit());
        promotion = promotionRepository.save(promotion);
        return PromotionDTO.toDTO(promotion);
    }
}
