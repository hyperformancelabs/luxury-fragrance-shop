package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.MaterialTransactionListResponse;
import com.hyperformancelabs.backend.dto.MaterialTransactionDTO;
import com.hyperformancelabs.backend.dto.MaterialTransactionCreateRequest;
import com.hyperformancelabs.backend.dto.MaterialTransactionUpdateRequest;
import org.springframework.data.domain.Sort;

import java.util.Map;

public interface MaterialTransactionService {
    /**
     * Get all material transactions with filtering, sorting and pagination
     *
     * @param page Page number (0-based)
     * @param size Items per page
     * @param sortBy Field to sort by
     * @param sortDirection Sort direction (ASC/DESC)
     * @param filters Additional filter parameters
     * @return Paginated list of material transactions
     */
    MaterialTransactionListResponse getAllMaterialTransactions(
            int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters);

    /**
     * Get a specific material transaction by ID
     */
    MaterialTransactionDTO getMaterialTransactionById(Integer transactionId);

    /**
     * Create a new material transaction and update material stock
     */
    MaterialTransactionDTO createMaterialTransaction(MaterialTransactionCreateRequest request, Integer performedBy);

    /**
     * Update an existing material transaction (metadata or quantity/type) and adjust stock accordingly
     */
    MaterialTransactionDTO updateMaterialTransaction(Integer transactionId, MaterialTransactionUpdateRequest request);

    /**
     * Delete a material transaction (reverting stock change)
     */
    void deleteMaterialTransaction(Integer transactionId);
} 