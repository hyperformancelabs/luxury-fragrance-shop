package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Integer> {
}
