package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.SellTransactionSummaryDTO;
import com.hyperformancelabs.backend.repository.InventoryTransactionRepository;
import com.hyperformancelabs.backend.service.InventoryTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    @Autowired
    InventoryTransactionRepository inventoryTransactionRepository;

    @Override
    public SellTransactionSummaryDTO getSellTransactionSummary(){
        return inventoryTransactionRepository.getSellTransactionSummaryInCurrentWeek();
    }

    @Override
    public SellTransactionSummaryDTO getSellTransactionSummaryInToday() {
        return inventoryTransactionRepository.getSellTransactionSummaryInToday();
    }

    @Override
    public SellTransactionSummaryDTO getSellTransactionSummaryInCurrentWeek() {
        return inventoryTransactionRepository.getSellTransactionSummaryInCurrentWeek();
    }

    @Override
    public SellTransactionSummaryDTO getSellTransactionSummaryInCurrentMonth() {
        return inventoryTransactionRepository.getSellTransactionSummaryInCurrentMonth();
    }

    @Override
    public SellTransactionSummaryDTO getSellTransactionSummaryInCurrentYear() {
        return inventoryTransactionRepository.getSellTransactionSummaryInCurrentYear();
    }

    @Override
    public SellTransactionSummaryDTO getSellTransactionSummaryByDateRange(String startDate, String endDate) {
        return inventoryTransactionRepository.getSellTransactionSummaryByDateRange(startDate, endDate);
    }

    @Override
    public SellTransactionSummaryDTO getSellTransactionSummaryByQuarterAndYear(int quarter, int year) {
        return inventoryTransactionRepository.getSellTransactionSummaryByQuarterAndYear(quarter, year);
    }
}
