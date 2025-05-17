package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.BrandDto;
import com.hyperformancelabs.backend.dto.BrandRequestDto;
import com.hyperformancelabs.backend.dto.SearchResponseDto;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Brand;
import com.hyperformancelabs.backend.repository.BrandRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @PreAuthorize("hasAuthority('brand.view')")
    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('brand.view')")
    public BrandDto getBrandById(Integer brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));
        return convertToDto(brand);
    }

    @PreAuthorize("hasAuthority('brand.create')")
    public BrandDto createBrand(BrandRequestDto brandRequestDto) {
        if (brandRepository.existsByBrandName(brandRequestDto.getBrandName())) {
            throw new DuplicateResourceException("Brand with name '" + brandRequestDto.getBrandName() + "' already exists.");
        }
        Brand brand = new Brand();
        brand.setBrandName(brandRequestDto.getBrandName());
        brand.setBrandDescription(brandRequestDto.getBrandDescription());
        brand.setCountryOfOrigin(brandRequestDto.getCountryOfOrigin());
        brand.setLogoUrl(brandRequestDto.getLogoUrl());
        brand.setWebsiteUrl(brandRequestDto.getWebsiteUrl());
        Brand savedBrand = brandRepository.save(brand);
        return convertToDto(savedBrand);
    }

    @PreAuthorize("hasAuthority('brand.edit')")
    public BrandDto updateBrand(Integer brandId, BrandRequestDto brandRequestDto) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));

        // Check if brand name is being changed and if the new name already exists for another brand
        if (!brand.getBrandName().equals(brandRequestDto.getBrandName()) && brandRepository.existsByBrandName(brandRequestDto.getBrandName())) {
            throw new DuplicateResourceException("Another brand with name '" + brandRequestDto.getBrandName() + "' already exists.");
        }

        brand.setBrandName(brandRequestDto.getBrandName());
        brand.setBrandDescription(brandRequestDto.getBrandDescription());
        brand.setCountryOfOrigin(brandRequestDto.getCountryOfOrigin());
        brand.setLogoUrl(brandRequestDto.getLogoUrl());
        brand.setWebsiteUrl(brandRequestDto.getWebsiteUrl());
        Brand updatedBrand = brandRepository.save(brand);
        return convertToDto(updatedBrand);
    }

    @PreAuthorize("hasAuthority('brand.delete')")
    public void deleteBrand(Integer brandId) {
        if (!brandRepository.existsById(brandId)) {
            throw new ResourceNotFoundException("Brand not found with id: " + brandId);
        }
        brandRepository.deleteById(brandId);
    }

    private BrandDto convertToDto(Brand brand) {
        return new BrandDto(
                brand.getBrandId(),
                brand.getBrandName(),
                brand.getBrandDescription(),
                brand.getCountryOfOrigin(),
                brand.getLogoUrl(),
                brand.getWebsiteUrl()
        );
    }
    
    /**
     * Search brands by name for autocomplete
     * 
     * @param searchTerm The search term to match against brand names
     * @param limit Maximum number of results to return
     * @return SearchResponseDto containing matching brands and whether there's an exact match
     */
    @PreAuthorize("hasAuthority('brand.view')")
    public SearchResponseDto<BrandDto> searchBrandsByName(String searchTerm, int limit) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // If search term is empty, return all brands (limited)
            List<BrandDto> allBrands = brandRepository.findAll().stream()
                    .sorted(Comparator.comparing(Brand::getBrandName))
                    .limit(limit)
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return new SearchResponseDto<>(allBrands, false);
        }
        
        // Search for brands matching the search term
        List<Brand> matchingBrands = brandRepository.findByBrandNameContainingIgnoreCase(searchTerm.trim());
        
        // Check if there's an exact match
        boolean hasExactMatch = matchingBrands.stream()
                .anyMatch(brand -> brand.getBrandName().equalsIgnoreCase(searchTerm.trim()));
        
        // Convert to DTOs, sort by relevance and limit results
        List<BrandDto> brandDtos = matchingBrands.stream()
                .sorted((a, b) -> {
                    // Exact matches first
                    boolean aExact = a.getBrandName().equalsIgnoreCase(searchTerm.trim());
                    boolean bExact = b.getBrandName().equalsIgnoreCase(searchTerm.trim());
                    if (aExact && !bExact) return -1;
                    if (!aExact && bExact) return 1;
                    
                    // Starts with matches next
                    boolean aStartsWith = a.getBrandName().toLowerCase().startsWith(searchTerm.trim().toLowerCase());
                    boolean bStartsWith = b.getBrandName().toLowerCase().startsWith(searchTerm.trim().toLowerCase());
                    if (aStartsWith && !bStartsWith) return -1;
                    if (!aStartsWith && bStartsWith) return 1;
                    
                    // Alphabetical order for the rest
                    return a.getBrandName().compareToIgnoreCase(b.getBrandName());
                })
                .limit(limit)
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return new SearchResponseDto<>(brandDtos, hasExactMatch);
    }
}
