package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Material;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    private Integer materialId;
    private String materialName;
    private String description;
    private String unit;
    private Integer quantityInStock;
    private Integer reorderLevel;
    private BigDecimal price;

    public static MaterialDTO toDTO(Material material) {
        return new MaterialDTO(
                material.getMaterialId(),
                material.getMaterialName(),
                material.getDescription(),
                material.getUnit(),
                material.getQuantityInStock(),
                material.getReorderLevel(),
                material.getPrice()
        );
    }
}
