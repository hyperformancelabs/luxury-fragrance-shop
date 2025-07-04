package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.MaterialTransactionListResponse;
import com.hyperformancelabs.backend.dto.MaterialTransactionDTO;
import com.hyperformancelabs.backend.dto.MaterialTransactionCreateRequest;
import com.hyperformancelabs.backend.dto.MaterialTransactionUpdateRequest;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.MaterialTransactionService;
import com.hyperformancelabs.backend.util.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emp/material-transactions")
public class MaterialTransactionManagementController {

    private static final Logger logger = LoggerFactory.getLogger(MaterialTransactionManagementController.class);

    @Autowired
    private MaterialTransactionService materialTransactionService;

    @Autowired
    private SecurityUtils securityUtils;

    /**
     * Get all material transactions with pagination, sorting and filtering
     *
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Field to sort by (default: "transactionDate")
     * @param sortDir Sort direction ("asc" or "desc", default: "desc")
     * @param transactionType Filter by transaction type (optional, allow multiple)
     * @param materialId Filter by material ID (optional)
     * @param performedBy Filter by employee ID (optional)
     * @param search Search keyword across fields (optional)
     * @param startDate Start date filter (yyyy-MM-dd or ISO date time)
     * @param endDate End date filter (yyyy-MM-dd or ISO date time)
     * @return Paginated list response
     */
    @GetMapping
    @PreAuthorize("hasAuthority('material_transaction.view')")
    public ResponseEntity<ApiResponse<MaterialTransactionListResponse>> getAllMaterialTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) List<String> transactionType,
            @RequestParam(required = false) Integer materialId,
            @RequestParam(required = false) Integer performedBy,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        try {
            logger.info("Fetching material transactions page={}, size={}", page, size);

            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

            Map<String, String> filters = new HashMap<>();
            if (transactionType != null && !transactionType.isEmpty()) {
                filters.put("transactionType", String.join(",", transactionType));
            }
            if (materialId != null) {
                filters.put("materialId", materialId.toString());
            }
            if (performedBy != null) {
                filters.put("performedBy", performedBy.toString());
            }
            if (search != null && !search.trim().isEmpty()) {
                filters.put("search", search.trim());
            }
            if (startDate != null && endDate != null) {
                filters.put("startDate", startDate);
                filters.put("endDate", endDate);
            }

            MaterialTransactionListResponse response = materialTransactionService.getAllMaterialTransactions(
                    page, size, sortBy, direction, filters);

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy danh sách giao dịch vật liệu thành công",
                    response));
        } catch (Exception e) {
            logger.error("Error fetching material transactions", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy danh sách giao dịch vật liệu: " + e.getMessage(),
                    null));
        }
    }

    /**
     * Get material transaction by ID
     */
    @GetMapping("/{transactionId}")
    @PreAuthorize("hasAuthority('material_transaction.view')")
    public ResponseEntity<ApiResponse<MaterialTransactionDTO>> getMaterialTransactionById(@PathVariable Integer transactionId){
        try {
            MaterialTransactionDTO dto = materialTransactionService.getMaterialTransactionById(transactionId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Lấy thông tin giao dịch vật liệu thành công", dto));
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(new ApiResponse<>(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /**
     * Create new material transaction
     */
    @PostMapping
    @PreAuthorize("hasAuthority('material_transaction.manage')")
    public ResponseEntity<ApiResponse<MaterialTransactionDTO>> createMaterialTransaction(@Valid @RequestBody MaterialTransactionCreateRequest request){
        try {
            Integer empId = securityUtils.getCurrentEmployeeId();
            MaterialTransactionDTO dto = materialTransactionService.createMaterialTransaction(request, empId);
            return ResponseEntity.status(201).body(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Tạo giao dịch vật liệu thành công", dto));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /**
     * Update existing material transaction
     */
    @PutMapping("/{transactionId}")
    @PreAuthorize("hasAuthority('material_transaction.manage')")
    public ResponseEntity<ApiResponse<MaterialTransactionDTO>> updateMaterialTransaction(@PathVariable Integer transactionId, @Valid @RequestBody MaterialTransactionUpdateRequest request){
        try {
            MaterialTransactionDTO dto = materialTransactionService.updateMaterialTransaction(transactionId, request);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Cập nhật giao dịch vật liệu thành công", dto));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /**
     * Delete material transaction
     */
    @DeleteMapping("/{transactionId}")
    @PreAuthorize("hasAuthority('material_transaction.manage')")
    public ResponseEntity<ApiResponse<Void>> deleteMaterialTransaction(@PathVariable Integer transactionId){
        try {
            materialTransactionService.deleteMaterialTransaction(transactionId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Xóa giao dịch vật liệu thành công", null));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 