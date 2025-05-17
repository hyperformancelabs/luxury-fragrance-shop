package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.InventoryTransactionCreateRequest;
import com.hyperformancelabs.backend.dto.InventoryTransactionDTO;
import com.hyperformancelabs.backend.dto.InventoryTransactionListResponse;
import com.hyperformancelabs.backend.dto.InventoryTransactionUpdateRequest;
import com.hyperformancelabs.backend.dto.SellTransactionSummaryDTO;
import org.springframework.data.domain.Sort;

import java.util.Map;

public interface InventoryTransactionService {
    public SellTransactionSummaryDTO getSellTransactionSummaryInToday();

    public SellTransactionSummaryDTO getSellTransactionSummary();

    public SellTransactionSummaryDTO getSellTransactionSummaryInCurrentWeek();

    public SellTransactionSummaryDTO getSellTransactionSummaryInCurrentMonth();

    public SellTransactionSummaryDTO getSellTransactionSummaryInCurrentYear();

    public SellTransactionSummaryDTO getSellTransactionSummaryByDateRange(String startDate, String endDate);

    public SellTransactionSummaryDTO getSellTransactionSummaryByQuarterAndYear(int quarter, int year);

    /**
     * Get all inventory transactions with filtering, sorting and pagination
     *
     * @param page Page number (0-based)
     * @param size Items per page
     * @param sortBy Field to sort by
     * @param sortDirection Sort direction (ASC/DESC)
     * @param filters Additional filter parameters
     * @return Paginated list of inventory transactions
     */
    InventoryTransactionListResponse getAllInventoryTransactions(
            int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters);
    
    /**
     * Get a specific inventory transaction by ID
     *
     * @param transactionId Inventory transaction ID
     * @return Inventory transaction details
     */
    InventoryTransactionDTO getInventoryTransactionById(Integer transactionId);
    
    /**
     * Create a new inventory transaction
     *
     * @param request Inventory transaction create request
     * @param performedBy ID of the employee performing the transaction
     * @return Created inventory transaction
     */
    InventoryTransactionDTO createInventoryTransaction(InventoryTransactionCreateRequest request, Integer performedBy);
    
    /**
     * Update an existing inventory transaction
     *
     * @param transactionId Inventory transaction ID to update
     * @param request Inventory transaction update request
     * @return Updated inventory transaction
     */
    InventoryTransactionDTO updateInventoryTransaction(Integer transactionId, InventoryTransactionUpdateRequest request);
    
    /**
     * Delete an inventory transaction
     *
     * @param transactionId Inventory transaction ID to delete
     */
    void deleteInventoryTransaction(Integer transactionId);
}
