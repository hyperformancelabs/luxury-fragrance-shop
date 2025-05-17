package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    // Method to check if a brand with the given name already exists
    boolean existsByBrandName(String brandName);
    
    // Method to find brands by name containing a search term (case insensitive)
    List<Brand> findByBrandNameContainingIgnoreCase(String brandName);
    
    // Method to find top N brands by name containing a search term
    @Query(value = "SELECT b FROM Brand b WHERE LOWER(b.brandName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY b.brandName ASC")
    List<Brand> searchBrandsByName(@Param("searchTerm") String searchTerm);
}
