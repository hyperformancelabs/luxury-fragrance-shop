package com.hyperformancelabs.backend.service.impl;


import com.hyperformancelabs.backend.dto.MaterialDTO;
import com.hyperformancelabs.backend.model.Material;
import com.hyperformancelabs.backend.repository.MaterialRepository;
import com.hyperformancelabs.backend.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public Page<MaterialDTO> getAllMaterials(int page) {
        PageRequest pageable = PageRequest.of(page, 25);
        Page<Material> materialPage = materialRepository.findAll(pageable);
        return materialPage.map(MaterialDTO::toDTO);
    }

    @Override
    public MaterialDTO updateMaterial(Integer id, MaterialDTO materialDTO) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        material.setMaterialName(materialDTO.getMaterialName());
        material.setDescription(materialDTO.getDescription());
        material.setUnit(materialDTO.getUnit());
        material.setQuantityInStock(materialDTO.getQuantityInStock());
        material.setReorderLevel(materialDTO.getReorderLevel());
        material.setPrice(materialDTO.getPrice());
        material = materialRepository.save(material);
        return MaterialDTO.toDTO(material);
    }
}
