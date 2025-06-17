package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.PromotionCreateRequest;
import com.hyperformancelabs.backend.dto.PromotionDTO;
import com.hyperformancelabs.backend.dto.PromotionListResponse;
import com.hyperformancelabs.backend.dto.PromotionUpdateRequest;
import com.hyperformancelabs.backend.dto.ProductPromotionDTO;
import com.hyperformancelabs.backend.dto.ProductPromotionCreateRequest;
import com.hyperformancelabs.backend.dto.PromotionInventorySummaryDTO;
import com.hyperformancelabs.backend.dto.PromotionSalesSummaryDTO;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

public interface PromotionManagementService {
    PromotionListResponse getAllPromotions(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters);

    PromotionDTO getPromotionById(Integer promotionId);

    PromotionDTO createPromotion(PromotionCreateRequest request);

    PromotionDTO updatePromotion(Integer promotionId, PromotionUpdateRequest request);

    void deletePromotion(Integer promotionId);

    List<ProductPromotionDTO> getPromotionProducts(Integer promotionId);

    void addProductsToPromotion(Integer promotionId, List<ProductPromotionCreateRequest> requests);

    void removeProductFromPromotion(Integer promotionId, Integer productId);

    PromotionInventorySummaryDTO getInventorySummary(Integer promotionId);

    PromotionSalesSummaryDTO getSalesSummary(Integer promotionId, String startDate, String endDate);

    long getUsage(Integer promotionId);
} 