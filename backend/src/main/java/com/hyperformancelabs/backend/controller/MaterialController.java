package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.MaterialDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.impl.MaterialServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/materials")
public class MaterialController {

    @Autowired
    private MaterialServiceImpl materialService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MaterialDTO>>> getAllMaterials(@RequestParam(defaultValue = "0") int page) {
        try {
            Page<MaterialDTO> materials = materialService.getAllMaterials(page);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            materials
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<MaterialDTO>> updateMaterial(@PathVariable Integer id, @RequestBody MaterialDTO materialDTO) {
        try {
            MaterialDTO updatedMaterial = materialService.updateMaterial(id, materialDTO);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            ApiResponseStatus.UPDATE_SUCCESS_MESSAGE,
                            updatedMaterial
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }
}
