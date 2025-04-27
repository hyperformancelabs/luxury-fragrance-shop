package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.SellTransactionSummaryDTO;
import com.hyperformancelabs.backend.repository.InventoryTransactionRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

public interface InventoryTransactionService {

    public SellTransactionSummaryDTO getSellTransactionSummary();
}
