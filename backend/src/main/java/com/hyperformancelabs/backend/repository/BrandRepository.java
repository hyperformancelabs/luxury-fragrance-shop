package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    @Query("SELECT b.brandName FROM Brand b ORDER BY b.brandName")
    List<String> findAllBrandNames();
}
