package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.MaterialCreateRequest;
import com.hyperformancelabs.backend.dto.MaterialDTO;
import com.hyperformancelabs.backend.dto.MaterialListResponse;
import com.hyperformancelabs.backend.dto.MaterialUpdateRequest;
import org.springframework.data.domain.Sort;

import java.util.Map;

public interface MaterialService {
    /**
     * Get all materials with pagination, sorting, and filtering
     *
     * @param page             Page number (0-based)
     * @param size             Page size
     * @param sortBy           Field to sort by
     * @param sortDirection    Sort direction (ASC/DESC)
     * @param filters          Map of filter criteria
     * @return                 MaterialListResponse containing materials and pagination info
     */
    MaterialListResponse getAllMaterials(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters);
    
    /**
     * Get a specific material by ID
     *
     * @param materialId       Material ID
     * @return                 Material details
     */
    MaterialDTO getMaterialById(Integer materialId);
    
    /**
     * Create a new material
     *
     * @param request          Material create request
     * @return                 Created material details
     */
    MaterialDTO createMaterial(MaterialCreateRequest request);
    
    /**
     * Update an existing material
     *
     * @param materialId       Material ID
     * @param request          Material update request
     * @return                 Updated material details
     */
    MaterialDTO updateMaterial(Integer materialId, MaterialUpdateRequest request);
    
    /**
     * Delete a material
     *
     * @param materialId       Material ID
     */
    void deleteMaterial(Integer materialId);
    
    /**
     * Search materials by name (real-time)
     *
     * @param query            Search query
     * @return                 List of materials matching the query
     */
    MaterialListResponse searchMaterials(String query, int page, int size);
}
