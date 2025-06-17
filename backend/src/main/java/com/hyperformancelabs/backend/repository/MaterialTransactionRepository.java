package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.MaterialTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialTransactionRepository extends JpaRepository<MaterialTransaction, Integer>, JpaSpecificationExecutor<MaterialTransaction> {
    /**
     * Delete all transactions belonging to a given material.
     * @param materialId id of the material whose transactions should be removed
     */
    void deleteByMaterial_MaterialId(Integer materialId);
}
