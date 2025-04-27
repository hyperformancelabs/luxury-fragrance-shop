package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.dto.SellTransactionSummaryDTO;
import com.hyperformancelabs.backend.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Integer> {
    @Query(value = """
        SELECT 
            COUNT(*) AS totalSellTransactions,
            ISNULL(SUM(cost_price), 0) AS totalCostPrice
        FROM InventoryTransaction
        WHERE transaction_type = 'sell'
          AND transaction_date >= DATEADD(DAY, -(DATEPART(WEEKDAY, GETDATE()) + 5) % 7, CAST(GETDATE() AS DATE))
          AND transaction_date <= DATEADD(DAY, 6 - (DATEPART(WEEKDAY, GETDATE()) + 5) % 7, CAST(GETDATE() AS DATE))
        """, nativeQuery = true)
    SellTransactionSummaryDTO getSellTransactionSummaryInCurrentWeek();
}
