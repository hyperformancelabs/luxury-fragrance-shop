package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.MaterialCreateRequest;
import com.hyperformancelabs.backend.dto.MaterialDTO;
import com.hyperformancelabs.backend.dto.MaterialListResponse;
import com.hyperformancelabs.backend.dto.MaterialUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Material;
import com.hyperformancelabs.backend.repository.MaterialRepository;
import com.hyperformancelabs.backend.service.MaterialService;
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
public class MaterialServiceImpl implements MaterialService {
    private static final Logger logger = LoggerFactory.getLogger(MaterialServiceImpl.class);

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    @PreAuthorize("hasAuthority('material.view')")
    @Transactional(readOnly = true)
    public MaterialListResponse getAllMaterials(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        try {
            logger.info("Getting materials page={}, size={}, sortBy={}, sortDirection={}, filters={}", 
                page, size, sortBy, sortDirection, filters);
                
            // Create sort object
            Sort sort = Sort.by(sortDirection, sortBy);
            
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Apply filters
            Page<Material> materialPage;
            
            if (filters.containsKey("materialName")) {
                String materialName = filters.get("materialName");
                logger.info("Filtering by material name: {}", materialName);
                materialPage = materialRepository.findByMaterialNameContainingIgnoreCase(materialName, pageable);
            } else {
                logger.info("No filters applied");
                materialPage = materialRepository.findAll(pageable);
            }
            
            logger.info("Found {} materials", materialPage.getTotalElements());
            
            // Map to DTOs
            List<MaterialDTO> materialDTOs = new ArrayList<>();
            for (Material material : materialPage.getContent()) {
                MaterialDTO dto = MaterialDTO.toDTO(material);
                materialDTOs.add(dto);
            }
            
            // Create response
            MaterialListResponse response = new MaterialListResponse(
                materialDTOs,
                materialPage.getTotalElements(),
                materialPage.getTotalPages(),
                materialPage.getNumber()
            );
            
            return response;
        } catch (Exception e) {
            logger.error("Error getting materials", e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('material.view')")
    @Transactional(readOnly = true)
    public MaterialDTO getMaterialById(Integer materialId) {
        try {
            logger.info("Getting material with ID: {}", materialId);
            
            Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + materialId));
            
            return MaterialDTO.toDTO(material);
        } catch (Exception e) {
            logger.error("Error getting material with ID: {}", materialId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('material.create')")
    @Transactional
    public MaterialDTO createMaterial(MaterialCreateRequest request) {
        try {
            logger.info("Creating new material with name: {}", request.getMaterialName());
            
            // Check if material with same name already exists
            if (materialRepository.existsByMaterialName(request.getMaterialName())) {
                throw new DuplicateResourceException("Material with name '" + request.getMaterialName() + 
                    "' already exists");
            }
            
            // Create new material
            Material material = new Material();
            material.setMaterialName(request.getMaterialName());
            material.setDescription(request.getDescription());
            material.setUnit(request.getUnit());
            material.setQuantityInStock(request.getQuantityInStock());
            material.setReorderLevel(request.getReorderLevel());
            material.setPrice(request.getPrice());
            
            // Save to database
            Material savedMaterial = materialRepository.save(material);
            logger.info("Created material with ID: {}", savedMaterial.getMaterialId());
            
            // Map to DTO and return
            return MaterialDTO.toDTO(savedMaterial);
        } catch (Exception e) {
            logger.error("Error creating material", e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('material.edit')")
    @Transactional
    public MaterialDTO updateMaterial(Integer materialId, MaterialUpdateRequest request) {
        try {
            logger.info("Updating material with ID: {}", materialId);
            
            Material material = materialRepository.findById(materialId)
                    .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + materialId));
            
            // Check if material with same name already exists (excluding current material)
            if (!material.getMaterialName().equals(request.getMaterialName()) && 
                materialRepository.existsByMaterialName(request.getMaterialName())) {
                throw new DuplicateResourceException("Material with name '" + request.getMaterialName() + 
                    "' already exists");
            }
            
            material.setMaterialName(request.getMaterialName());
            material.setDescription(request.getDescription());
            material.setUnit(request.getUnit());
            material.setReorderLevel(request.getReorderLevel());
            material.setPrice(request.getPrice());
            
            Material updatedMaterial = materialRepository.save(material);
            logger.info("Updated material with ID: {}", materialId);
            
            return MaterialDTO.toDTO(updatedMaterial);
        } catch (Exception e) {
            logger.error("Error updating material with ID: {}", materialId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('material.delete')")
    @Transactional
    public void deleteMaterial(Integer materialId) {
        try {
            logger.info("Deleting material with ID: {}", materialId);
            
            // Check if material exists
            Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + materialId));
            
            // Delete material
            materialRepository.delete(material);
            logger.info("Deleted material with ID: {}", materialId);
        } catch (Exception e) {
            logger.error("Error deleting material with ID: {}", materialId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('material.view')")
    @Transactional(readOnly = true)
    public MaterialListResponse searchMaterials(String query, int page, int size) {
        try {
            logger.info("Searching materials with query: {}", query);
            
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "materialName"));
            
            // Search materials
            Page<Material> materialPage = materialRepository.findByMaterialNameContainingIgnoreCase(query, pageable);
            logger.info("Found {} materials matching query", materialPage.getTotalElements());
            
            // Map to DTOs
            List<MaterialDTO> materialDTOs = new ArrayList<>();
            for (Material material : materialPage.getContent()) {
                MaterialDTO dto = MaterialDTO.toDTO(material);
                materialDTOs.add(dto);
            }
            
            // Create response
            MaterialListResponse response = new MaterialListResponse(
                materialDTOs,
                materialPage.getTotalElements(),
                materialPage.getTotalPages(),
                materialPage.getNumber()
            );
            
            return response;
        } catch (Exception e) {
            logger.error("Error searching materials with query: {}", query, e);
            throw e;
        }
    }
}
