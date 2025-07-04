package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.MaterialTransactionDTO;
import com.hyperformancelabs.backend.dto.MaterialTransactionListResponse;
import com.hyperformancelabs.backend.dto.MaterialTransactionCreateRequest;
import com.hyperformancelabs.backend.dto.MaterialTransactionUpdateRequest;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.model.Material;
import com.hyperformancelabs.backend.model.MaterialTransaction;
import com.hyperformancelabs.backend.repository.MaterialTransactionRepository;
import com.hyperformancelabs.backend.repository.MaterialRepository;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.service.MaterialTransactionService;
import com.hyperformancelabs.backend.util.DateTimeUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
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
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class MaterialTransactionServiceImpl implements MaterialTransactionService {
    private static final Logger logger = LoggerFactory.getLogger(MaterialTransactionServiceImpl.class);

    @Autowired
    private MaterialTransactionRepository materialTransactionRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EntityManager entityManager;

    @Override
    @PreAuthorize("hasAuthority('material_transaction.view')")
    @Transactional(readOnly = true)
    public MaterialTransactionListResponse getAllMaterialTransactions(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        try {
            logger.info("Getting material transactions page={}, size={}, sortBy={}, sortDirection={}, filters={}",
                    page, size, sortBy, sortDirection, filters);

            Sort sort = Sort.by(sortDirection, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);

            Page<MaterialTransaction> transactionPage;

            if (filters != null && !filters.isEmpty()) {
                Specification<MaterialTransaction> spec = null;

                // transactionType filter (supports multiple types)
                if (filters.containsKey("transactionType")) {
                    String transactionTypeParam = filters.get("transactionType");
                    List<String> types = Arrays.asList(transactionTypeParam.split(","));
                    if (!types.isEmpty()) {
                        Specification<MaterialTransaction> typeSpec = (root, query, cb) -> {
                            if (types.size() == 1) {
                                return cb.equal(root.get("transactionType"), types.get(0));
                            }
                            return root.get("transactionType").in(types);
                        };
                        spec = mergeSpec(spec, typeSpec);
                    }
                }

                // materialId filter
                if (filters.containsKey("materialId")) {
                    Integer materialId = Integer.parseInt(filters.get("materialId"));
                    Specification<MaterialTransaction> materialSpec = (root, query, cb) ->
                            cb.equal(root.get("material").get("materialId"), materialId);
                    spec = mergeSpec(spec, materialSpec);
                }

                // performedBy filter
                if (filters.containsKey("performedBy")) {
                    Integer performedBy = Integer.parseInt(filters.get("performedBy"));
                    Specification<MaterialTransaction> performedBySpec = (root, query, cb) ->
                            cb.equal(root.get("performedBy").get("employeeId"), performedBy);
                    spec = mergeSpec(spec, performedBySpec);
                }

                // date range filter
                if (filters.containsKey("startDate") && filters.containsKey("endDate")) {
                    try {
                        LocalDateTime start = parseDate(filters.get("startDate"), true);
                        LocalDateTime end = parseDate(filters.get("endDate"), false);
                        Specification<MaterialTransaction> dateSpec = (root, query, cb) -> cb.and(
                                cb.greaterThanOrEqualTo(root.get("transactionDate"), start),
                                cb.lessThanOrEqualTo(root.get("transactionDate"), end));
                        spec = mergeSpec(spec, dateSpec);
                    } catch (Exception ex) {
                        logger.error("Failed to parse date range", ex);
                    }
                }

                // search filter (across fields)
                if (filters.containsKey("search")) {
                    String searchValue = filters.get("search").toLowerCase();
                    String pattern = "%" + searchValue + "%";
                    Specification<MaterialTransaction> searchSpec = (root, query, cb) -> cb.or(
                            cb.like(cb.lower(root.get("transactionType")), pattern),
                            cb.like(cb.lower(root.get("reason")), pattern),
                            cb.like(cb.lower(root.get("note")), pattern),
                            cb.like(cb.lower(root.get("material").get("materialName")), pattern),
                            cb.like(cb.lower(root.get("performedBy").get("fullName")), pattern)
                    );
                    spec = mergeSpec(spec, searchSpec);
                }

                transactionPage = spec != null ? materialTransactionRepository.findAll(spec, pageable) : materialTransactionRepository.findAll(pageable);
            } else {
                transactionPage = materialTransactionRepository.findAll(pageable);
            }

            List<MaterialTransactionDTO> dtos = new ArrayList<>();
            for (MaterialTransaction transaction : transactionPage.getContent()) {
                dtos.add(mapToDTO(transaction));
            }

            return new MaterialTransactionListResponse(
                    dtos,
                    transactionPage.getTotalElements(),
                    transactionPage.getTotalPages(),
                    transactionPage.getNumber());
        } catch (Exception ex) {
            logger.error("Error getting material transactions", ex);
            throw ex;
        }
    }

    private Specification<MaterialTransaction> mergeSpec(Specification<MaterialTransaction> base, Specification<MaterialTransaction> add) {
        return base == null ? add : base.and(add);
    }

    private LocalDateTime parseDate(String input, boolean startOfDay) {
        try {
            if (input.contains("T")) {
                return LocalDateTime.parse(input);
            } else {
                return LocalDateTime.parse(input + (startOfDay ? "T00:00:00" : "T23:59:59"));
            }
        } catch (DateTimeParseException e) {
            logger.error("Failed to parse date: {}", input);
            throw e;
        }
    }

    private MaterialTransactionDTO mapToDTO(MaterialTransaction t) {
        MaterialTransactionDTO dto = new MaterialTransactionDTO();
        dto.setMaterialTransactionId(t.getMaterialTransactionId());
        if (t.getMaterial() != null) {
            dto.setMaterialId(t.getMaterial().getMaterialId());
            dto.setMaterialName(t.getMaterial().getMaterialName());
        }
        if (t.getPerformedBy() != null) {
            dto.setPerformedById(t.getPerformedBy().getEmployeeId());
            dto.setPerformedByName(t.getPerformedBy().getFullName());
        }
        dto.setTransactionType(t.getTransactionType());
        dto.setTransactionDate(t.getTransactionDate());
        dto.setBeforeQuantity(t.getBeforeQuantity());
        dto.setQuantity(t.getQuantity());
        dto.setAfterQuantity(t.getAfterQuantity());
        dto.setReason(t.getReason());
        dto.setNote(t.getNote());
        dto.setCostPrice(t.getCostPrice());
        return dto;
    }

    @Override
    @PreAuthorize("hasAuthority('material_transaction.view')")
    @Transactional(readOnly = true)
    public MaterialTransactionDTO getMaterialTransactionById(Integer transactionId) {
        logger.info("Getting material transaction with ID: {}", transactionId);
        MaterialTransaction transaction = materialTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch vật liệu với ID: " + transactionId));
        return mapToDTO(transaction);
    }

    @Override
    @PreAuthorize("hasAuthority('material_transaction.manage')")
    @Transactional
    public MaterialTransactionDTO createMaterialTransaction(MaterialTransactionCreateRequest request, Integer performedBy) {
        try {
            logger.info("Creating material transaction for material ID: {}, performedBy: {}", request.getMaterialId(), performedBy);

            Material material = materialRepository.findById(request.getMaterialId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vật liệu với ID: " + request.getMaterialId()));

            Employee employee = employeeRepository.findById(performedBy)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + performedBy));

            MaterialTransaction transaction = new MaterialTransaction();
            transaction.setMaterial(material);
            transaction.setPerformedBy(employee);
            transaction.setTransactionType(request.getTransactionType());

            // Handle transactionDate similar to inventory service
            java.time.LocalDateTime transactionTime;
            if (request.getTransactionDate() != null) {
                transactionTime = request.getTransactionDate().atStartOfDay();
                transactionTime = DateTimeUtil.combineDateWithCurrentTime(transactionTime);
            } else {
                transactionTime = DateTimeUtil.getCurrentDateTime();
            }

            try {
                Query q = entityManager.createNativeQuery("SELECT GETDATE()");
                java.sql.Timestamp dbNow = (java.sql.Timestamp) q.getSingleResult();
                if (transactionTime.isAfter(dbNow.toLocalDateTime())) {
                    transactionTime = dbNow.toLocalDateTime();
                }
            } catch (Exception ignore) {}

            transaction.setTransactionDate(transactionTime);

            transaction.setBeforeQuantity(material.getQuantityInStock());
            transaction.setQuantity(request.getQuantity());

            int afterQuantity;
            switch (request.getTransactionType()) {
                case "import":
                    afterQuantity = material.getQuantityInStock() + request.getQuantity();
                    break;
                case "export":
                    afterQuantity = material.getQuantityInStock() - request.getQuantity();
                    if (afterQuantity < 0) {
                        throw new IllegalArgumentException("Không đủ số lượng vật liệu trong kho. Hiện có: " + material.getQuantityInStock());
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

            // Update stock
            material.setQuantityInStock(afterQuantity);
            materialRepository.save(material);

            MaterialTransaction saved = materialTransactionRepository.save(transaction);
            return mapToDTO(saved);

        } catch (Exception e) {
            logger.error("Error creating material transaction", e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('material_transaction.manage')")
    @Transactional
    public MaterialTransactionDTO updateMaterialTransaction(Integer transactionId, MaterialTransactionUpdateRequest request) {
        try {
            logger.info("Updating material transaction ID: {}", transactionId);

            MaterialTransaction transaction = materialTransactionRepository.findById(transactionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch vật liệu với ID: " + transactionId));

            Material material = transaction.getMaterial();

            String originalType = transaction.getTransactionType();
            int originalQty = transaction.getQuantity();

            // Revert original effect
            int stock = material.getQuantityInStock();
            switch (originalType) {
                case "import":
                    stock -= originalQty; break;
                case "export":
                    stock += originalQty; break;
                case "adjust":
                    stock = transaction.getBeforeQuantity(); break;
            }

            // Apply request changes
            if (request.getTransactionType() != null) {
                transaction.setTransactionType(request.getTransactionType());
            }
            if (request.getQuantity() != null) {
                transaction.setQuantity(request.getQuantity());
            }
            if (request.getReason() != null) transaction.setReason(request.getReason());
            if (request.getNote() != null) transaction.setNote(request.getNote());
            if (request.getCostPrice() != null) transaction.setCostPrice(request.getCostPrice());

            int newAfter;
            switch (transaction.getTransactionType()) {
                case "import":
                    newAfter = stock + transaction.getQuantity();
                    break;
                case "export":
                    newAfter = stock - transaction.getQuantity();
                    if (newAfter < 0) throw new IllegalArgumentException("Không đủ hàng sau khi cập nhật");
                    break;
                case "adjust":
                    newAfter = transaction.getQuantity();
                    break;
                default:
                    throw new IllegalArgumentException("Loại giao dịch không hợp lệ");
            }

            transaction.setBeforeQuantity(stock);
            transaction.setAfterQuantity(newAfter);

            material.setQuantityInStock(newAfter);
            materialRepository.save(material);

            MaterialTransaction saved = materialTransactionRepository.save(transaction);
            return mapToDTO(saved);

        } catch (Exception e) {
            logger.error("Error updating material transaction", e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('material_transaction.manage')")
    @Transactional
    public void deleteMaterialTransaction(Integer transactionId) {
        try {
            logger.info("Deleting material transaction ID: {}", transactionId);
            MaterialTransaction transaction = materialTransactionRepository.findById(transactionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch vật liệu với ID: " + transactionId));

            Material material = transaction.getMaterial();

            // Revert effect before delete
            int newStock;
            switch (transaction.getTransactionType()) {
                case "import":
                    newStock = material.getQuantityInStock() - transaction.getQuantity();
                    break;
                case "export":
                    newStock = material.getQuantityInStock() + transaction.getQuantity();
                    break;
                case "adjust":
                    newStock = transaction.getBeforeQuantity();
                    break;
                default:
                    newStock = material.getQuantityInStock();
            }

            material.setQuantityInStock(newStock);
            materialRepository.save(material);

            materialTransactionRepository.delete(transaction);
        } catch (Exception e) {
            logger.error("Error deleting material transaction", e);
            throw e;
        }
    }
} 