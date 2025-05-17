package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandRequestDto {

    @NotBlank(message = "Brand name cannot be empty")
    @Size(max = 100, message = "Brand name must be less than 100 characters")
    private String brandName;

    private String brandDescription;

    @Size(max = 100, message = "Country of origin must be less than 100 characters")
    private String countryOfOrigin;

    @Size(max = 255, message = "Logo URL must be less than 255 characters")
    private String logoUrl;

    @Pattern(regexp = "^(http://|https://|).*$", message = "Invalid website URL format")
    @Size(max = 255, message = "Website URL must be less than 255 characters")
    private String websiteUrl;
}
