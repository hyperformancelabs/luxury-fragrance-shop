package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.PromotionCreateRequest;
import com.hyperformancelabs.backend.dto.PromotionDTO;
import com.hyperformancelabs.backend.dto.PromotionListResponse;
import com.hyperformancelabs.backend.dto.PromotionUpdateRequest;
import com.hyperformancelabs.backend.dto.ProductPromotionDTO;
import com.hyperformancelabs.backend.dto.ProductPromotionCreateRequest;
import com.hyperformancelabs.backend.dto.PromotionInventorySummaryDTO;
import com.hyperformancelabs.backend.dto.PromotionSalesSummaryDTO;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Promotion;
import com.hyperformancelabs.backend.repository.PromotionRepository;
import com.hyperformancelabs.backend.service.PromotionManagementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PromotionManagementServiceImpl implements PromotionManagementService {

    private static final Logger logger = LoggerFactory.getLogger(PromotionManagementServiceImpl.class);

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.ProductRepository productRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.ProductPromotionRepository productPromotionRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.ProductVariantRepository productVariantRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.OrderPromotionRepository orderPromotionRepository;

    @Override
    @PreAuthorize("hasAuthority('promotion.view')")
    @Transactional(readOnly = true)
    public PromotionListResponse getAllPromotions(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        try {
            logger.info("Getting promotions page={}, size={}, sortBy={}, sortDirection={}, filters={}", page, size, sortBy, sortDirection, filters);
            updatePromotionStatuses();

            Sort sort = Sort.by(sortDirection, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);

            Page<Promotion> promotionPage;

            boolean hasNameFilter = filters.containsKey("promotionName");
            boolean hasStatusFilter = filters.containsKey("status");

            if (hasNameFilter && hasStatusFilter) {
                // Not having a repository method for both; fetch by status then filter by name in memory
                String status = filters.get("status");
                String nameFilter = filters.get("promotionName").toLowerCase();
                promotionPage = promotionRepository.findByStatus(status, pageable).map(p -> p); // page remains same
                // Filtering content in memory
                List<Promotion> filteredContent = promotionPage.getContent().stream()
                        .filter(p -> p.getPromotionName() != null && p.getPromotionName().toLowerCase().contains(nameFilter))
                        .toList();
                promotionPage = new org.springframework.data.domain.PageImpl<>(filteredContent, pageable, filteredContent.size());
            } else if (hasNameFilter) {
                String name = filters.get("promotionName");
                promotionPage = promotionRepository.findByPromotionNameContainingIgnoreCase(name, pageable);
            } else if (hasStatusFilter) {
                String status = filters.get("status");
                promotionPage = promotionRepository.findByStatus(status, pageable);
            } else {
                promotionPage = promotionRepository.findAll(pageable);
            }

            List<PromotionDTO> promotionDTOs = new ArrayList<>();
            for (Promotion p : promotionPage.getContent()) {
                promotionDTOs.add(PromotionDTO.toDTO(p));
            }

            return new PromotionListResponse(
                    promotionDTOs,
                    promotionPage.getTotalElements(),
                    promotionPage.getTotalPages(),
                    promotionPage.getNumber()
            );
        } catch (Exception e) {
            logger.error("Error getting promotions", e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.view')")
    @Transactional(readOnly = true)
    public PromotionDTO getPromotionById(Integer promotionId) {
        try {
            logger.info("Getting promotion with ID: {}", promotionId);
            Promotion promotion = promotionRepository.findById(promotionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + promotionId));
            return PromotionDTO.toDTO(promotion);
        } catch (Exception e) {
            logger.error("Error getting promotion with ID: {}", promotionId, e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.create')")
    @Transactional
    public PromotionDTO createPromotion(PromotionCreateRequest request) {
        try {
            logger.info("Creating promotion with name: {}", request.getPromotionName());
            if (promotionRepository.existsByPromotionName(request.getPromotionName())) {
                throw new DuplicateResourceException("Promotion with name '" + request.getPromotionName() + "' already exists");
            }
            Promotion promotion = new Promotion();
            promotion.setPromotionName(request.getPromotionName());
            promotion.setDescription(request.getDescription());
            promotion.setStartDate(request.getStartDate());
            promotion.setEndDate(request.getEndDate());
            promotion.setDiscountType(request.getDiscountType());
            promotion.setDiscountValue(request.getDiscountValue());
            // Set default status to 'active' if not specified
            promotion.setStatus(request.getStatus() != null ? request.getStatus() : "active");
            promotion.setUsageLimit(request.getUsageLimit());

            Promotion saved = promotionRepository.save(promotion);
            logger.info("Created promotion with ID: {}", saved.getPromotionId());
            return PromotionDTO.toDTO(saved);
        } catch (Exception e) {
            logger.error("Error creating promotion", e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.edit')")
    @Transactional
    public PromotionDTO updatePromotion(Integer promotionId, PromotionUpdateRequest request) {
        try {
            logger.info("Updating promotion with ID: {}", promotionId);
            logger.info("Update request data: {}", request);
            
            Promotion promotion = promotionRepository.findById(promotionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + promotionId));

            logger.info("Found existing promotion: {}", promotion);

            // Check duplicate name if changed
            if (request.getPromotionName() != null && !request.getPromotionName().equals(promotion.getPromotionName()) &&
                    promotionRepository.existsByPromotionName(request.getPromotionName())) {
                throw new DuplicateResourceException("Promotion with name '" + request.getPromotionName() + "' already exists");
            }

            // Track changes for debugging
            StringBuilder changes = new StringBuilder();
            
            if (request.getPromotionName() != null) {
                changes.append(String.format("Name: '%s' -> '%s', ", promotion.getPromotionName(), request.getPromotionName()));
                promotion.setPromotionName(request.getPromotionName());
            }
            if (request.getDescription() != null) {
                changes.append(String.format("Description updated, "));
                promotion.setDescription(request.getDescription());
            }
            if (request.getStartDate() != null) {
                changes.append(String.format("StartDate: '%s' -> '%s', ", promotion.getStartDate(), request.getStartDate()));
                promotion.setStartDate(request.getStartDate());
            }
            if (request.getEndDate() != null || (request.getEndDate() == null && promotion.getEndDate() != null)) {
                changes.append(String.format("EndDate: '%s' -> '%s', ", promotion.getEndDate(), request.getEndDate()));
                promotion.setEndDate(request.getEndDate());
            }
            if (request.getDiscountType() != null) {
                changes.append(String.format("DiscountType: '%s' -> '%s', ", promotion.getDiscountType(), request.getDiscountType()));
                promotion.setDiscountType(request.getDiscountType());
            }
            if (request.getDiscountValue() != null) {
                changes.append(String.format("DiscountValue: '%s' -> '%s', ", promotion.getDiscountValue(), request.getDiscountValue()));
                promotion.setDiscountValue(request.getDiscountValue());
            }
            if (request.getStatus() != null) {
                changes.append(String.format("Status: '%s' -> '%s', ", promotion.getStatus(), request.getStatus()));
                promotion.setStatus(request.getStatus());
            }
            if (request.getUsageLimit() != null || (request.getUsageLimit() == null && promotion.getUsageLimit() != null)) {
                changes.append(String.format("UsageLimit: '%s' -> '%s', ", promotion.getUsageLimit(), request.getUsageLimit()));
                promotion.setUsageLimit(request.getUsageLimit());
            }
            
            logger.info("Changes to apply: {}", changes.toString());

            // Save the updated entity
            Promotion updated = promotionRepository.save(promotion);
            logger.info("Updated promotion saved to database: {}", updated);
            
            // Verify the update was successful by reading back from the database
            Promotion verified = promotionRepository.findById(promotionId).orElse(null);
            if (verified != null) {
                logger.info("Verified saved promotion from database: {}", verified);
            } else {
                logger.warn("Could not verify saved promotion - not found in database after save!");
            }
            
            return PromotionDTO.toDTO(updated);
        } catch (Exception e) {
            logger.error("Error updating promotion with ID: {}", promotionId, e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.delete')")
    @Transactional
    public void deletePromotion(Integer promotionId) {
        try {
            logger.info("Deleting promotion with ID: {}", promotionId);
            Promotion promotion = promotionRepository.findById(promotionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + promotionId));
            promotionRepository.delete(promotion);
            logger.info("Deleted promotion with ID: {}", promotionId);
        } catch (Exception e) {
            logger.error("Error deleting promotion with ID: {}", promotionId, e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.view')")
    public java.util.List<ProductPromotionDTO> getPromotionProducts(Integer promotionId) {
        var list = productPromotionRepository.findByPromotion_PromotionId(promotionId);
        return list.stream().map(this::mapToDTO).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.edit')")
    @Transactional
    public void addProductsToPromotion(Integer promotionId, java.util.List<ProductPromotionCreateRequest> requests) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + promotionId));

        for (ProductPromotionCreateRequest req : requests) {
            if (productPromotionRepository.existsByPromotion_PromotionIdAndProductVariant_ProductVariantId(promotionId, req.getProductVariantId())) {
                throw new DuplicateResourceException("Variant " + req.getProductVariantId() + " already in promotion " + promotionId);
            }
            var variant = productVariantRepository.findById(req.getProductVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant not found with id: " + req.getProductVariantId()));

            com.hyperformancelabs.backend.model.ProductPromotion pp = new com.hyperformancelabs.backend.model.ProductPromotion();
            pp.setPromotion(promotion);
            pp.setProductVariant(variant);
            pp.setConditionJson(req.getConditionJson());
            pp.setMaxDiscountAmount(req.getMaxDiscountAmount());
            pp.setStartDate(req.getStartDate() != null ? req.getStartDate() : promotion.getStartDate());
            pp.setEndDate(req.getEndDate() != null ? req.getEndDate() : promotion.getEndDate());
            pp.setStatus(req.getStatus() != null ? req.getStatus() : "active");
            productPromotionRepository.save(pp);
        }
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.edit')")
    @Transactional
    public void removeProductFromPromotion(Integer promotionId, Integer productId) {
        var list = productPromotionRepository.findByPromotion_PromotionId(promotionId);
        for (var pp : list) {
            if (pp.getProductVariant().getProduct().getProductId().equals(productId)) {
                productPromotionRepository.delete(pp);
                return;
            }
        }
        throw new ResourceNotFoundException("Product not associated with promotion");
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.view')")
    @Transactional(readOnly = true)
    public PromotionInventorySummaryDTO getInventorySummary(Integer promotionId) {
        var pps = productPromotionRepository.findByPromotion_PromotionId(promotionId);
        int totalProducts = pps.size();
        int totalVariants = 0;
        int totalInventory = 0;
        int outOfStockProducts = 0;
        for (var pp : pps) {
            var variants = productVariantRepository.findByProduct(pp.getProductVariant().getProduct(), org.springframework.data.domain.Pageable.unpaged()).getContent();
            totalVariants += variants.size();
            int productInventory = variants.stream().mapToInt(v -> v.getQuantityInStock() != null ? v.getQuantityInStock() : 0).sum();
            totalInventory += productInventory;
            if (productInventory == 0) outOfStockProducts++;
        }
        return new PromotionInventorySummaryDTO(totalProducts, totalVariants, totalInventory, outOfStockProducts);
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.view')")
    public PromotionSalesSummaryDTO getSalesSummary(Integer promotionId, String startDateStr, String endDateStr) {
        java.sql.Date startDate = null;
        java.sql.Date endDate = null;
        try {
            if (startDateStr != null && !startDateStr.isEmpty()) {
                startDate = java.sql.Date.valueOf(startDateStr);
            }
            if (endDateStr != null && !endDateStr.isEmpty()) {
                endDate = java.sql.Date.valueOf(endDateStr);
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid date format. Expected yyyy-MM-dd", e);
        }
        var map = orderPromotionRepository.getSalesSummary(promotionId, startDate, endDate);
        long totalOrders = map.get("totalOrders") != null ? ((Number) map.get("totalOrders")).longValue() : 0L;
        java.math.BigDecimal revenue = map.get("revenue") != null ? (java.math.BigDecimal) map.get("revenue") : java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalDiscount = map.get("totalDiscount") != null ? (java.math.BigDecimal) map.get("totalDiscount") : java.math.BigDecimal.ZERO;
        PromotionSalesSummaryDTO dto = new PromotionSalesSummaryDTO();
        dto.setPromotionId(promotionId);
        dto.setStartDate(startDate != null ? startDate.toLocalDate() : null);
        dto.setEndDate(endDate != null ? endDate.toLocalDate() : null);
        dto.setTotalOrders(totalOrders);
        dto.setGrossRevenue(revenue);
        dto.setTotalDiscount(totalDiscount);
        return dto;
    }

    @Override
    @PreAuthorize("hasAuthority('promotion.view')")
    @Transactional(readOnly = true)
    public java.util.List<PromotionDTO> getUpcomingPromotions(int limit) {
        java.time.LocalDate today = java.time.LocalDate.now();
        // Ensure statuses are up to date before fetching
        updatePromotionStatuses();

        java.util.List<Promotion> list = promotionRepository.findActiveAndNotExpired(today);

        if (limit > 0 && list.size() > limit) {
            list = list.subList(0, limit);
        }

        return list.stream().map(this::mapToPromotionDTOWithStats).toList();
    }

    @Override
    public long getUsage(Integer promotionId) {
        return orderPromotionRepository.countByPromotion_PromotionId(promotionId);
    }

    private ProductPromotionDTO mapToDTO(com.hyperformancelabs.backend.model.ProductPromotion pp) {
        ProductPromotionDTO dto = new ProductPromotionDTO();
        dto.setProductPromotionId(pp.getProductPromotionId());
        dto.setProductId(pp.getProductVariant().getProduct().getProductId());
        dto.setProductName(pp.getProductVariant().getProduct().getProductName());
        dto.setBrandName(pp.getProductVariant().getProduct().getBrand().getBrandName());
        dto.setConditionJson(pp.getConditionJson());
        dto.setMaxDiscountAmount(pp.getMaxDiscountAmount());
        dto.setStartDate(pp.getStartDate());
        dto.setEndDate(pp.getEndDate());
        dto.setStatus(pp.getStatus());
        dto.setProductVariantId(pp.getProductVariant().getProductVariantId());
        dto.setVolume(pp.getProductVariant().getVolume());
        return dto;
    }

    private void updatePromotionStatuses() {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.util.List<Promotion> promotions = promotionRepository.findAll();
        for (Promotion p : promotions) {
            if (p.getEndDate() != null && today.isAfter(p.getEndDate())) {
                // Expired campaigns
                if (!"expired".equalsIgnoreCase(p.getStatus())) {
                    p.setStatus("expired");
                }
            } else {
                // All campaigns that have not expired are considered "active"
                if (!"active".equalsIgnoreCase(p.getStatus())) {
                    p.setStatus("active");
                }
            }
        }
        promotionRepository.saveAll(promotions);
    }

    private PromotionDTO mapToPromotionDTOWithStats(Promotion promotion) {
        PromotionDTO dto = PromotionDTO.toDTO(promotion);
        
        // Calculate current usage
        long currentUsage = orderPromotionRepository.countByPromotion_PromotionId(promotion.getPromotionId());
        dto.setCurrentUsage(currentUsage);
        
        // Calculate usage percentage
        if (promotion.getUsageLimit() != null && promotion.getUsageLimit() > 0) {
            double usagePercentage = (double) currentUsage / promotion.getUsageLimit() * 100;
            dto.setUsagePercentage(Math.min(100.0, usagePercentage));
        } else {
            dto.setUsagePercentage(null);
        }
        
        // Calculate time progress percentage
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate startDate = promotion.getStartDate();
        java.time.LocalDate endDate = promotion.getEndDate();
        
        if (startDate != null) {
            if (endDate != null) {
                // Has both start and end date
                long totalDays = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
                if (totalDays > 0) {
                    if (today.isBefore(startDate)) {
                        dto.setTimeProgressPercentage(0.0);
                    } else if (today.isAfter(endDate)) {
                        dto.setTimeProgressPercentage(100.0);
                    } else {
                        long daysPassed = java.time.temporal.ChronoUnit.DAYS.between(startDate, today);
                        double timeProgress = (double) daysPassed / totalDays * 100;
                        dto.setTimeProgressPercentage(Math.min(100.0, Math.max(0.0, timeProgress)));
                    }
                } else {
                    dto.setTimeProgressPercentage(100.0); // Same day campaign
                }
            } else {
                // No end date - calculate based on days since start
                if (today.isBefore(startDate)) {
                    dto.setTimeProgressPercentage(0.0);
                } else {
                    // For ongoing campaigns without end date, we can't calculate meaningful progress
                    dto.setTimeProgressPercentage(null);
                }
            }
        } else {
            dto.setTimeProgressPercentage(null);
        }
        
        return dto;
    }
} 