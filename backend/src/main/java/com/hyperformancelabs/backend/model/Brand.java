package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing perfume brands in the system.
 * Contains information about manufacturers and brand details.
 */
@Entity
@Table(name = "Brand")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brand {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private Integer brandId;
    
    @Column(name = "brand_name", length = 100, nullable = false, unique = true)
    @NotBlank(message = "Brand name is required")
    private String brandName;
    
    @Column(name = "brand_description", columnDefinition = "NVARCHAR(MAX)")
    private String brandDescription;
    
    @Column(name = "country_of_origin", length = 100)
    private String countryOfOrigin;
    
    @Column(name = "logo_url", length = 255)
    private String logoUrl;
    
    @Column(name = "website_url", length = 255)
    private String websiteUrl;
    
    @OneToMany(mappedBy = "brand")
    private Set<Product> products = new HashSet<>();
}