package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CustomerListResponse;
import com.hyperformancelabs.backend.dto.CustomerDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import com.hyperformancelabs.backend.dto.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/emp/customers")
public class CustomerManagementController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerManagementController.class);

    @Autowired
    private CustomerService customerService;

    /**
     * Get all customers with pagination, sorting, and filtering
     * @param page page number (0-based)
     * @param size page size
     * @param sortBy field to sort (default: createAt)
     * @param sortDir sort direction (asc|desc)
     * @param name filter by name contains
     * @param phone filter by phone contains
     * @param email filter by email contains
     * @param status filter by status exact
     * @return CustomerListResponse wrapped in ApiResponse
     */
    @GetMapping
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<CustomerListResponse>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status
    ) {
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Map<String, String> filters = new HashMap<>();
            if (name != null && !name.isEmpty()) filters.put("name", name);
            if (phone != null && !phone.isEmpty()) filters.put("phone", phone);
            if (email != null && !email.isEmpty()) filters.put("email", email);
            if (status != null && !status.isEmpty()) filters.put("status", status);

            CustomerListResponse response = customerService.getAllCustomers(page, size, sortBy, direction, filters);

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    response
            ));
        } catch (Exception e) {
            logger.error("Error getting customers", e);
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(
                            ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            "Lỗi khi lấy danh sách khách hàng: " + e.getMessage(),
                            null
                    )
            );
        }
    }

    /**
     * Search customers by keyword (name, username, phone, email)
     */
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<CustomerListResponse>> searchCustomers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            CustomerListResponse response = customerService.searchCustomers(keyword, page, size);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    ApiResponseStatus.GET_SUCCESS_MESSAGE,
                    response
            ));
        } catch (Exception e) {
            logger.error("Error searching customers", e);
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(
                            ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            "Lỗi khi tìm kiếm khách hàng: " + e.getMessage(),
                            null
                    )
            );
        }
    }

    /** Get customer by id */
    @GetMapping("/{customerId}")
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<CustomerDTO>> getCustomerById(@PathVariable Integer customerId) {
        try {
            CustomerDTO dto = customerService.getCustomerById(customerId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /** Create customer */
    @PostMapping
    @PreAuthorize("hasAuthority('customer.create')")
    public ResponseEntity<ApiResponse<CustomerDTO>> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        try {
            CustomerDTO dto = customerService.createCustomer(request);
            return ResponseEntity.status(201).body(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.CREATE_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /** Update customer */
    @PutMapping("/{customerId}")
    @PreAuthorize("hasAuthority('customer.edit')")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateCustomer(@PathVariable Integer customerId, @Valid @RequestBody CustomerUpdateRequest request) {
        try {
            CustomerDTO dto = customerService.updateCustomer(customerId, request);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /** Delete customer */
    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasAuthority('customer.delete')")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Integer customerId) {
        try {
            customerService.deleteCustomer(customerId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.DELETE_SUCCESS_MESSAGE, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    /** Update status */
    @PatchMapping("/{customerId}/status")
    @PreAuthorize("hasAuthority('customer.edit')")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateStatus(@PathVariable Integer customerId, @Valid @RequestBody StatusUpdateRequest request) {
        try {
            CustomerDTO dto = customerService.updateCustomerStatus(customerId, request.getStatus());
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @PatchMapping("/{customerId}/rating")
    @PreAuthorize("hasAuthority('customer.edit')")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateRating(@PathVariable Integer customerId, @Valid @RequestBody RatingUpdateRequest request) {
        try {
            CustomerDTO dto = customerService.updateCustomerRating(customerId, request.getRating());
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @PatchMapping("/{customerId}/loyalty-points")
    @PreAuthorize("hasAuthority('customer.edit')")
    public ResponseEntity<ApiResponse<CustomerDTO>> adjustLoyaltyPoints(@PathVariable Integer customerId, @Valid @RequestBody LoyaltyPointsAdjustRequest request) {
        try {
            CustomerDTO dto = customerService.adjustLoyaltyPoints(customerId, request.getDelta());
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 