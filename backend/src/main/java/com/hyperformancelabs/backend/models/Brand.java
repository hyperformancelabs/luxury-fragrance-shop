package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

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
    private String brandName;
    
    @Column(name = "brand_description", columnDefinition = "NVARCHAR(MAX)")
    private String brandDescription;
    
    @Column(name = "country_of_origin", length = 50)
    private String countryOfOrigin;
    
    @Column(name = "logo_url", length = 255)
    private String logoUrl;
    
    @Column(name = "website_url", length = 255)
    private String websiteUrl;
    
    @OneToMany(mappedBy = "brand")
    private Set<Product> products = new HashSet<>();
} 