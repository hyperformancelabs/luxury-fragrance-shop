package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.FilterOptionDTO;
import com.hyperformancelabs.backend.repository.BrandRepository;
import com.hyperformancelabs.backend.repository.ProductDetailRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductDetailServiceImpl implements ProductDetailService {

    @Autowired
    private ProductDetailRepository productDetailRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Override
    public List<String> getAllToneScents() {
        return productDetailRepository.findAllToneScents();
    }

    @Override
    public List<String> getAllStyles() {
        return productDetailRepository.findAllStyles();
    }
    
    @Override
    public FilterOptionDTO getFilterOptions() {
        FilterOptionDTO filterOptions = new FilterOptionDTO();
        
        // Get all brands
        List<String> brands = brandRepository.findAllBrandNames();
        filterOptions.setBrands(brands);
        
        // Get all volumes
        List<Integer> volumes = productVariantRepository.findAllDistinctVolumes();
        filterOptions.setVolumes(volumes);
        
        // Get price range
        BigDecimal minPrice = productVariantRepository.findMinPrice();
        BigDecimal maxPrice = productVariantRepository.findMaxPrice();
        Map<String, Object> priceRange = new HashMap<>();
        priceRange.put("min", minPrice);
        priceRange.put("max", maxPrice);
        filterOptions.setPriceRange(priceRange);
        
        // Get product details with counts <= 20, excluding base_note, middle_note, top_note
        Map<String, List<String>> productDetailsMap = new HashMap<>();
        
        // Get detail names with count <= 20 and not in excluded list
        List<Object[]> validDetailNames = productDetailRepository.findDetailNamesWithCountLessThan20();
        
        for (Object[] detailNameData : validDetailNames) {
            String detailName = (String) detailNameData[0];
            
            // Get distinct values for this detail name
            List<String> detailValues = productDetailRepository.findDistinctDetailValuesByDetailNameNative(detailName);
            
            if (!detailValues.isEmpty()) {
                // Convert detail_name from database format to frontend format
                String formattedDetailName = formatDetailName(detailName);
                productDetailsMap.put(formattedDetailName, detailValues);
            }
        }
        
        // Manually add specific filters if needed based on your frontend requirements
        // For example, if you need to ensure certain filters are always present
        ensureFilterExists(productDetailsMap, "style");
        ensureFilterExists(productDetailsMap, "tone_scent");
        ensureFilterExists(productDetailsMap, "suitable_gender");
        
        filterOptions.setProductDetails(productDetailsMap);
        
        return filterOptions;
    }
    
    private void ensureFilterExists(Map<String, List<String>> productDetailsMap, String detailName) {
        String formattedName = formatDetailName(detailName);
        
        // If the filter doesn't exist yet, add it with actual values from database
        if (!productDetailsMap.containsKey(formattedName)) {
            List<String> values = productDetailRepository.findDistinctDetailValuesByDetailNameNative(detailName);
            if (!values.isEmpty()) {
                productDetailsMap.put(formattedName, values);
            }
        }
    }
    
    private String formatDetailName(String detailName) {
        // Convert snake_case to camelCase
        String[] parts = detailName.split("_");
        StringBuilder result = new StringBuilder(parts[0]);
        
        for (int i = 1; i < parts.length; i++) {
            if (parts[i].length() > 0) {
                result.append(Character.toUpperCase(parts[i].charAt(0)));
                if (parts[i].length() > 1) {
                    result.append(parts[i].substring(1));
                }
            }
        }
        
        return result.toString();
    }
}
