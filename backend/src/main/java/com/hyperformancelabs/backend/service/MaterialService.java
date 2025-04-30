package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.MaterialDTO;
import org.springframework.data.domain.Page;

public interface MaterialService {
    Page<MaterialDTO> getAllMaterials(int page);
    MaterialDTO updateMaterial(Integer id, MaterialDTO materialDTO);
}
