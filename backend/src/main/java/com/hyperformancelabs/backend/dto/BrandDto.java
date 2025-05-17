package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandDto {
    private Integer brandId;
    private String brandName;
    private String brandDescription;
    private String countryOfOrigin;
    private String logoUrl;
    private String websiteUrl;
}
