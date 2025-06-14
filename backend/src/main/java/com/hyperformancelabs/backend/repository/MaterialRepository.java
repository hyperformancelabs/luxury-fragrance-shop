package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
    Page<Material> findByMaterialNameContainingIgnoreCase(String materialName, Pageable pageable);
    
    boolean existsByMaterialName(String materialName);
}
