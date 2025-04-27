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
}
