package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.InventoryTransactionCreateRequest;
import com.hyperformancelabs.backend.dto.InventoryTransactionDTO;
import com.hyperformancelabs.backend.dto.InventoryTransactionListResponse;
import com.hyperformancelabs.backend.dto.InventoryTransactionUpdateRequest;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.InventoryTransactionService;
import com.hyperformancelabs.backend.util.SecurityUtils;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emp/inventory-transactions")
public class InventoryTransactionManagementController {

    private static final Logger logger = LoggerFactory.getLogger(InventoryTransactionManagementController.class);

    @Autowired
    private InventoryTransactionService inventoryTransactionService;
    
    @Autowired
    private SecurityUtils securityUtils;

    /**
     * Get all inventory transactions with pagination, sorting, and filtering
     *
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Field to sort by (default: "inventoryTransactionId")
     * @param sortDir Sort direction ("asc" or "desc", default: "desc")
     * @param transactionType Filter by transaction type (optional)
     * @param productVariantId Filter by product variant ID (optional)
     * @param productId Filter by product ID (optional)
     * @param performedBy Filter by performed by employee ID (optional)
     * @param search Search query (optional)
     * @param startDate Filter by start date (format: yyyy-MM-dd) (optional)
     * @param endDate Filter by end date (format: yyyy-MM-dd) (optional)
     * @return Paginated list of inventory transactions
     */
    @GetMapping
    @PreAuthorize("hasAuthority('inventory_transaction.view')")
    public ResponseEntity<ApiResponse<InventoryTransactionListResponse>> getAllInventoryTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) List<String> transactionType,
            @RequestParam(required = false) Integer productVariantId,
            @RequestParam(required = false) Integer productId,
            @RequestParam(required = false) Integer performedBy,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            logger.info("Getting inventory transactions, page={}, size={}...", page, size);
            
            // Create sort direction
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            
            // Create filters map
            Map<String, String> filters = new HashMap<>();
            if (transactionType != null && !transactionType.isEmpty()) {
                // Join multiple transaction types with comma for backend processing
                filters.put("transactionType", String.join(",", transactionType));
                logger.info("Filtering by transaction types: {}", transactionType);
            }
            if (productVariantId != null) {
                filters.put("productVariantId", productVariantId.toString());
            }
            if (productId != null) {
                filters.put("productId", productId.toString());
            }
            if (performedBy != null) {
                filters.put("performedBy", performedBy.toString());
            }
            if (search != null && !search.trim().isEmpty()) {
                filters.put("search", search.trim());
            }
            
            // Add date range filters
            if (startDate != null && endDate != null) {
                filters.put("startDate", startDate);
                filters.put("endDate", endDate);
            }
            
            // Get transactions
            InventoryTransactionListResponse transactions = inventoryTransactionService.getAllInventoryTransactions(
                page, size, sortBy, direction, filters);
            
            return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Lấy danh sách giao dịch tồn kho thành công",
                transactions
            ));
            
        } catch (Exception e) {
            logger.error("Error getting inventory transactions", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                ApiResponseStatus.ERROR_STATUS,
                "Lỗi khi lấy danh sách giao dịch tồn kho: " + e.getMessage(),
                null
            ));
        }
    }
    
    /**
     * Get inventory transaction by ID
     * 
     * @param transactionId Inventory transaction ID
     * @return Inventory transaction details
     */
    @GetMapping("/{transactionId}")
    @PreAuthorize("hasAuthority('inventory_transaction.view')")
    public ResponseEntity<ApiResponse<InventoryTransactionDTO>> getInventoryTransactionById(
            @PathVariable Integer transactionId) {
        try {
            logger.info("Getting inventory transaction with ID: {}", transactionId);
            
            InventoryTransactionDTO transaction = inventoryTransactionService.getInventoryTransactionById(transactionId);
            
            return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Lấy thông tin giao dịch tồn kho thành công",
                transaction
            ));
            
        } catch (ResourceNotFoundException e) {
            logger.error("Inventory transaction not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                ApiResponseStatus.NOT_FOUND_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            ));
        } catch (Exception e) {
            logger.error("Error getting inventory transaction", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                ApiResponseStatus.ERROR_STATUS,
                "Lỗi khi lấy thông tin giao dịch tồn kho: " + e.getMessage(),
                null
            ));
        }
    }
    
    /**
     * Create a new inventory transaction
     * 
     * @param request Inventory transaction create request
     * @return Created inventory transaction
     */
    @PostMapping
    @PreAuthorize("hasAuthority('inventory_transaction.manage')")
    public ResponseEntity<ApiResponse<InventoryTransactionDTO>> createInventoryTransaction(
            @Valid @RequestBody InventoryTransactionCreateRequest request) {
        try {
            logger.info("Creating inventory transaction for product variant ID: {}", 
                request.getProductVariantId());
            
            Integer currentEmployeeId = securityUtils.getCurrentEmployeeId();
            
            InventoryTransactionDTO createdTransaction = 
                inventoryTransactionService.createInventoryTransaction(request, currentEmployeeId);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Tạo giao dịch tồn kho thành công",
                createdTransaction
            ));
            
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found when creating inventory transaction", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                ApiResponseStatus.NOT_FOUND_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            ));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument when creating inventory transaction", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                ApiResponseStatus.BAD_REQUEST_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            ));
        } catch (Exception e) {
            logger.error("Error creating inventory transaction", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                ApiResponseStatus.ERROR_STATUS,
                "Lỗi khi tạo giao dịch tồn kho: " + e.getMessage(),
                null
            ));
        }
    }
    
    /**
     * Update an existing inventory transaction
     * 
     * @param transactionId Inventory transaction ID
     * @param request Inventory transaction update request
     * @return Updated inventory transaction
     */
    @PutMapping("/{transactionId}")
    @PreAuthorize("hasAuthority('inventory_transaction.manage')")
    public ResponseEntity<ApiResponse<InventoryTransactionDTO>> updateInventoryTransaction(
            @PathVariable Integer transactionId,
            @Valid @RequestBody InventoryTransactionUpdateRequest request) {
        try {
            logger.info("Updating inventory transaction with ID: {}", transactionId);
            
            InventoryTransactionDTO updatedTransaction = 
                inventoryTransactionService.updateInventoryTransaction(transactionId, request);
            
            return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Cập nhật giao dịch tồn kho thành công",
                updatedTransaction
            ));
            
        } catch (ResourceNotFoundException e) {
            logger.error("Inventory transaction not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                ApiResponseStatus.NOT_FOUND_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            ));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument when updating inventory transaction", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                ApiResponseStatus.BAD_REQUEST_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            ));
        } catch (Exception e) {
            logger.error("Error updating inventory transaction", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                ApiResponseStatus.ERROR_STATUS,
                "Lỗi khi cập nhật giao dịch tồn kho: " + e.getMessage(),
                null
            ));
        }
    }
    
    /**
     * Delete an inventory transaction
     * 
     * @param transactionId Inventory transaction ID
     * @return Success response
     */
    @DeleteMapping("/{transactionId}")
    @PreAuthorize("hasAuthority('inventory_transaction.manage')")
    public ResponseEntity<ApiResponse<Void>> deleteInventoryTransaction(
            @PathVariable Integer transactionId) {
        try {
            logger.info("Deleting inventory transaction with ID: {}", transactionId);
            
            inventoryTransactionService.deleteInventoryTransaction(transactionId);
            
            return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Xóa giao dịch tồn kho thành công",
                null
            ));
            
        } catch (ResourceNotFoundException e) {
            logger.error("Inventory transaction not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                ApiResponseStatus.NOT_FOUND_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            ));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument when deleting inventory transaction", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                ApiResponseStatus.BAD_REQUEST_CODE,
                ApiResponseStatus.ERROR_STATUS,
                e.getMessage(),
                null
            ));
        } catch (Exception e) {
            logger.error("Error deleting inventory transaction", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                ApiResponseStatus.ERROR_STATUS,
                "Lỗi khi xóa giao dịch tồn kho: " + e.getMessage(),
                null
            ));
        }
    }
} 