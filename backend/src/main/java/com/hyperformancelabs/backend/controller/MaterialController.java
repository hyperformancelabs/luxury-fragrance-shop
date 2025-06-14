package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.MaterialCreateRequest;
import com.hyperformancelabs.backend.dto.MaterialDTO;
import com.hyperformancelabs.backend.dto.MaterialListResponse;
import com.hyperformancelabs.backend.dto.MaterialUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.MaterialService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/emp/materials")
public class MaterialController {

    private static final Logger logger = LoggerFactory.getLogger(MaterialController.class);

    @Autowired
    private MaterialService materialService;

    /**
     * Get all materials with pagination, sorting, and filtering
     *
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Field to sort by (default: "materialId")
     * @param sortDir Sort direction ("asc" or "desc", default: "asc")
     * @param materialName Filter by material name (optional)
     * @return Paginated list of materials
     */
    @GetMapping
    @PreAuthorize("hasAuthority('material.view')")
    public ResponseEntity<ApiResponse<MaterialListResponse>> getAllMaterials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "materialId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String materialName) {
        
        try {
            logger.info("Getting all materials with page={}, size={}, sortBy={}, sortDir={}, materialName={}", 
                page, size, sortBy, sortDir, materialName);
            
            // Convert sort direction string to Sort.Direction enum
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
            
            // Create filters map
            Map<String, String> filters = new HashMap<>();
            if (materialName != null && !materialName.isEmpty()) {
                filters.put("materialName", materialName);
            }
            
            // Get materials
            MaterialListResponse response = materialService.getAllMaterials(page, size, sortBy, direction, filters);
            
            return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Lấy danh sách vật liệu thành công",
                response
            ));
        } catch (Exception e) {
            logger.error("Error getting materials: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy danh sách vật liệu: " + e.getMessage(),
                    null
                )
            );
        }
    }

    /**
     * Get a specific material by ID
     *
     * @param materialId Material ID
     * @return Material details
     */
    @GetMapping("/{materialId}")
    @PreAuthorize("hasAuthority('material.view')")
    public ResponseEntity<ApiResponse<MaterialDTO>> getMaterialById(
            @PathVariable Integer materialId) {
        
        try {
            logger.info("Getting material with ID: {}", materialId);
            
            MaterialDTO material = materialService.getMaterialById(materialId);
            
            return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Lấy thông tin vật liệu thành công",
                material
            ));
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error getting material: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy thông tin vật liệu: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Create a new material
     *
     * @param request Material create request
     * @return Created material details
     */
    @PostMapping
    @PreAuthorize("hasAuthority('material.create')")
    public ResponseEntity<ApiResponse<MaterialDTO>> createMaterial(
            @Valid @RequestBody MaterialCreateRequest request) {
        
        try {
            logger.info("Creating new material with name: {}", request.getMaterialName());
            
            MaterialDTO createdMaterial = materialService.createMaterial(request);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Tạo vật liệu mới thành công",
                    createdMaterial
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate material: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error creating material: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi tạo vật liệu mới: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Update an existing material
     *
     * @param materialId Material ID
     * @param request Material update request
     * @return Updated material details
     */
    @PutMapping("/{materialId}")
    @PreAuthorize("hasAuthority('material.edit')")
    public ResponseEntity<ApiResponse<MaterialDTO>> updateMaterial(
            @PathVariable Integer materialId,
            @Valid @RequestBody MaterialUpdateRequest request) {
        
        try {
            logger.info("Updating material with ID: {}", materialId);
            
            MaterialDTO updatedMaterial = materialService.updateMaterial(materialId, request);
            
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Cập nhật vật liệu thành công",
                    updatedMaterial
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (DuplicateResourceException e) {
            logger.error("Duplicate material: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiResponse<>(
                    ApiResponseStatus.CONFLICT_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error updating material: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi cập nhật vật liệu: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Delete a material
     *
     * @param materialId Material ID
     * @return Success message
     */
    @DeleteMapping("/{materialId}")
    @PreAuthorize("hasAuthority('material.delete')")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(
            @PathVariable Integer materialId) {
        
        try {
            logger.info("Deleting material with ID: {}", materialId);
            
            materialService.deleteMaterial(materialId);
            
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Xóa vật liệu thành công",
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            logger.error("Error deleting material: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi xóa vật liệu: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Search materials by name (real-time)
     *
     * @param query Search query
     * @param page Page number (0-based)
     * @param size Page size
     * @return Paginated list of materials matching the query
     */
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('material.view')")
    public ResponseEntity<ApiResponse<MaterialListResponse>> searchMaterials(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            logger.info("Searching materials with query: {}", query);
            
            MaterialListResponse response = materialService.searchMaterials(query, page, size);
            
            return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Tìm kiếm vật liệu thành công",
                response
            ));
        } catch (Exception e) {
            logger.error("Error searching materials: ", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi tìm kiếm vật liệu: " + e.getMessage(),
                    null
                )
            );
        }
    }
}
