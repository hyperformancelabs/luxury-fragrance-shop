package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.InventoryTransactionCreateRequest;
import com.hyperformancelabs.backend.dto.InventoryTransactionDTO;
import com.hyperformancelabs.backend.dto.InventoryTransactionListResponse;
import com.hyperformancelabs.backend.dto.InventoryTransactionUpdateRequest;
import com.hyperformancelabs.backend.dto.SellTransactionSummaryDTO;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.model.InventoryTransaction;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.repository.InventoryTransactionRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.InventoryTransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InventoryTransactionServiceImpl implements InventoryTransactionService {
    private static final Logger logger = LoggerFactory.getLogger(InventoryTransactionServiceImpl.class);

    @Autowired
    private InventoryTransactionRepository inventoryTransactionRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

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
    
    @Override
    @PreAuthorize("hasAuthority('inventory_transaction.view')")
    @Transactional(readOnly = true)
    public InventoryTransactionListResponse getAllInventoryTransactions(
            int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        try {
            logger.info("Getting inventory transactions page={}, size={}, sortBy={}, sortDirection={}, filters={}", 
                page, size, sortBy, sortDirection, filters);
                
            // Create sort object
            Sort sort = Sort.by(sortDirection, sortBy);
            
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Apply filters
            Page<InventoryTransaction> transactionPage;
            
            if (filters != null && !filters.isEmpty()) {
                Specification<InventoryTransaction> spec = null;
                
                // Filter by transaction type if provided
                if (filters.containsKey("transactionType")) {
                    String transactionType = filters.get("transactionType");
                    spec = (root, query, criteriaBuilder) -> 
                        criteriaBuilder.equal(root.get("transactionType"), transactionType);
                }
                
                // Filter by product variant ID if provided
                if (filters.containsKey("productVariantId")) {
                    Integer productVariantId = Integer.parseInt(filters.get("productVariantId"));
                    Specification<InventoryTransaction> productVariantSpec = (root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("productVariant").get("productVariantId"), productVariantId);
                    
                    spec = spec == null ? productVariantSpec : spec.and(productVariantSpec);
                }
                
                // Filter by performed by employee ID if provided
                if (filters.containsKey("performedBy")) {
                    Integer performedBy = Integer.parseInt(filters.get("performedBy"));
                    Specification<InventoryTransaction> performedBySpec = (root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("performedBy").get("employeeId"), performedBy);
                    
                    spec = spec == null ? performedBySpec : spec.and(performedBySpec);
                }
                
                // Apply specification if any filters were added
                transactionPage = spec != null
                    ? inventoryTransactionRepository.findAll(spec, pageable)
                    : inventoryTransactionRepository.findAll(pageable);
            } else {
                transactionPage = inventoryTransactionRepository.findAll(pageable);
            }
            
            // Map to DTOs
            List<InventoryTransactionDTO> transactionDTOs = new ArrayList<>();
            
            for (InventoryTransaction transaction : transactionPage.getContent()) {
                transactionDTOs.add(mapToDTO(transaction));
            }
            
            // Create response
            InventoryTransactionListResponse response = new InventoryTransactionListResponse(
                transactionDTOs,
                transactionPage.getTotalElements(),
                transactionPage.getTotalPages(),
                transactionPage.getNumber()
            );
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error getting inventory transactions", e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('inventory_transaction.view')")
    @Transactional(readOnly = true)
    public InventoryTransactionDTO getInventoryTransactionById(Integer transactionId) {
        logger.info("Getting inventory transaction with ID: {}", transactionId);
        
        InventoryTransaction transaction = inventoryTransactionRepository.findById(transactionId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch tồn kho với ID: " + transactionId));
        
        return mapToDTO(transaction);
    }
    
    @Override
    @PreAuthorize("hasAuthority('inventory_transaction.manage')")
    @Transactional
    public InventoryTransactionDTO createInventoryTransaction(
            InventoryTransactionCreateRequest request, Integer performedBy) {
        try {
            logger.info("Creating inventory transaction for product variant ID: {}, performed by: {}", 
                request.getProductVariantId(), performedBy);
            
            // Find the product variant
            ProductVariant productVariant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + request.getProductVariantId()));
            
            // Find the employee
            Employee employee = employeeRepository.findById(performedBy)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + performedBy));
            
            // Create the transaction
            InventoryTransaction transaction = new InventoryTransaction();
            transaction.setProductVariant(productVariant);
            transaction.setPerformedBy(employee);
            transaction.setTransactionType(request.getTransactionType());
            
            // Đảm bảo transaction_date không vượt quá GETDATE() của SQL Server
            LocalDateTime transactionTime;
            if (request.getTransactionDate() != null) {
                // Sử dụng ngày từ request và thiết lập thời gian là 10 giờ sáng
                transactionTime = request.getTransactionDate().atTime(10, 0, 0);
            } else {
                // Sử dụng ngày hôm qua để tránh vấn đề với ràng buộc CHECK
                transactionTime = LocalDateTime.now().minusDays(1).withHour(10).withMinute(0).withSecond(0);
            }
            transaction.setTransactionDate(transactionTime);
            
            transaction.setBeforeQuantity(productVariant.getQuantityInStock());
            transaction.setQuantity(request.getQuantity());
            
            // Calculate after quantity based on transaction type
            int afterQuantity;
            switch (request.getTransactionType()) {
                case "import":
                    afterQuantity = productVariant.getQuantityInStock() + request.getQuantity();
                    break;
                case "export":
                case "sell":
                case "combine":
                    afterQuantity = productVariant.getQuantityInStock() - request.getQuantity();
                    if (afterQuantity < 0) {
                        throw new IllegalArgumentException("Không đủ số lượng trong kho. Số lượng hiện tại: " 
                            + productVariant.getQuantityInStock());
                    }
                    break;
                case "adjust":
                    afterQuantity = request.getQuantity();
                    break;
                default:
                    throw new IllegalArgumentException("Loại giao dịch không hợp lệ: " + request.getTransactionType());
            }
            
            transaction.setAfterQuantity(afterQuantity);
            transaction.setReason(request.getReason());
            transaction.setNote(request.getNote());
            transaction.setCostPrice(request.getCostPrice());
            
            // Update product variant quantity
            productVariant.setQuantityInStock(afterQuantity);
            productVariantRepository.save(productVariant);
            
            // Save transaction
            InventoryTransaction savedTransaction = inventoryTransactionRepository.save(transaction);
            logger.info("Created inventory transaction with ID: {}", savedTransaction.getInventoryTransactionId());
            
            return mapToDTO(savedTransaction);
            
        } catch (Exception e) {
            logger.error("Error creating inventory transaction", e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('inventory_transaction.manage')")
    @Transactional
    public InventoryTransactionDTO updateInventoryTransaction(
            Integer transactionId, InventoryTransactionUpdateRequest request) {
        try {
            logger.info("Updating inventory transaction with ID: {}", transactionId);
            
            // Find the transaction
            InventoryTransaction transaction = inventoryTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch tồn kho với ID: " + transactionId));
            
            // Backup original values for reverting product variant quantity
            String originalType = transaction.getTransactionType();
            int originalQuantity = transaction.getQuantity();
            ProductVariant productVariant = transaction.getProductVariant();
            
            logger.info("Original values - Type: {}, Quantity: {}, Current stock: {}", 
                        originalType, originalQuantity, productVariant.getQuantityInStock());
            
            // If there are any changes that affect inventory quantity, revert the original transaction
            if (request.getTransactionType() != null && !request.getTransactionType().equals(originalType)
                    || request.getQuantity() != null && request.getQuantity() != originalQuantity) {
                
                // Revert product variant quantity to before this transaction
                int revertedQuantity = productVariant.getQuantityInStock();
                switch (originalType) {
                    case "import":
                        revertedQuantity -= originalQuantity;
                        break;
                    case "export":
                    case "sell":
                    case "combine":
                        revertedQuantity += originalQuantity;
                        break;
                    case "adjust":
                        revertedQuantity = transaction.getBeforeQuantity();
                        break;
                }
                
                logger.info("After reverting - revertedQuantity: {}", revertedQuantity);
                
                // Update transaction fields
                if (request.getTransactionType() != null) {
                    transaction.setTransactionType(request.getTransactionType());
                }
                
                if (request.getQuantity() != null) {
                    transaction.setQuantity(request.getQuantity());
                }
                
                logger.info("New transaction values - Type: {}, Quantity: {}", 
                           transaction.getTransactionType(), transaction.getQuantity());
                
                // Apply new transaction effect
                int afterQuantity;
                switch (transaction.getTransactionType()) {
                    case "import":
                        afterQuantity = revertedQuantity + transaction.getQuantity();
                        break;
                    case "export":
                    case "sell":
                    case "combine":
                        afterQuantity = revertedQuantity - transaction.getQuantity();
                        if (afterQuantity < 0) {
                            throw new IllegalArgumentException("Không đủ số lượng trong kho sau khi cập nhật. Số lượng sau khi hoàn tác: " 
                                + revertedQuantity);
                        }
                        break;
                    case "adjust":
                        afterQuantity = transaction.getQuantity();
                        break;
                    default:
                        throw new IllegalArgumentException("Loại giao dịch không hợp lệ: " + transaction.getTransactionType());
                }
                
                logger.info("Calculated afterQuantity: {}", afterQuantity);
                
                transaction.setAfterQuantity(afterQuantity);
                productVariant.setQuantityInStock(afterQuantity);
                productVariantRepository.save(productVariant);
            }
            
            // Update other fields
            if (request.getReason() != null) {
                transaction.setReason(request.getReason());
            }
            
            if (request.getNote() != null) {
                transaction.setNote(request.getNote());
            }
            
            if (request.getCostPrice() != null) {
                transaction.setCostPrice(request.getCostPrice());
            }
            
            // Save transaction
            InventoryTransaction updatedTransaction = inventoryTransactionRepository.save(transaction);
            logger.info("Updated inventory transaction with ID: {}", updatedTransaction.getInventoryTransactionId());
            
            return mapToDTO(updatedTransaction);
            
        } catch (Exception e) {
            logger.error("Error updating inventory transaction", e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('inventory_transaction.manage')")
    @Transactional
    public void deleteInventoryTransaction(Integer transactionId) {
        try {
            logger.info("Deleting inventory transaction with ID: {}", transactionId);
            
            // Find the transaction
            InventoryTransaction transaction = inventoryTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch tồn kho với ID: " + transactionId));
            
            // Revert the effect of this transaction on product variant quantity
            ProductVariant productVariant = transaction.getProductVariant();
            int revertedQuantity = productVariant.getQuantityInStock();
            
            switch (transaction.getTransactionType()) {
                case "import":
                    revertedQuantity -= transaction.getQuantity();
                    if (revertedQuantity < 0) {
                        throw new IllegalArgumentException(
                            "Không thể xóa giao dịch này vì số lượng sản phẩm sẽ âm sau khi xóa.");
                    }
                    break;
                case "export":
                case "sell":
                case "combine":
                    revertedQuantity += transaction.getQuantity();
                    break;
                case "adjust":
                    revertedQuantity = transaction.getBeforeQuantity();
                    break;
            }
            
            // Update product variant quantity
            productVariant.setQuantityInStock(revertedQuantity);
            productVariantRepository.save(productVariant);
            
            // Delete the transaction
            inventoryTransactionRepository.deleteById(transactionId);
            logger.info("Deleted inventory transaction with ID: {}", transactionId);
            
        } catch (Exception e) {
            logger.error("Error deleting inventory transaction", e);
            throw e;
        }
    }
    
    // Helper method to map Entity to DTO
    private InventoryTransactionDTO mapToDTO(InventoryTransaction transaction) {
        InventoryTransactionDTO dto = new InventoryTransactionDTO();
        dto.setInventoryTransactionId(transaction.getInventoryTransactionId());
        dto.setProductVariantId(transaction.getProductVariant().getProductVariantId());
        dto.setProductName(transaction.getProductVariant().getProduct().getProductName());
        dto.setVolume(transaction.getProductVariant().getVolume());
        dto.setPerformedById(transaction.getPerformedBy().getEmployeeId());
        dto.setPerformedByName(transaction.getPerformedBy().getFullName());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setBeforeQuantity(transaction.getBeforeQuantity());
        dto.setQuantity(transaction.getQuantity());
        dto.setAfterQuantity(transaction.getAfterQuantity());
        dto.setReason(transaction.getReason());
        dto.setNote(transaction.getNote());
        dto.setCostPrice(transaction.getCostPrice());
        return dto;
    }
}
