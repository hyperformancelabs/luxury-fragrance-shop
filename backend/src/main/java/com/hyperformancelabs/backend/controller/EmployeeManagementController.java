package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.EmployeeListResponse;
import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.dto.EmployeeUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.InvalidRequestException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.EmployeeManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/emp")
public class EmployeeManagementController {

    @Autowired
    private EmployeeManagementService employeeManagementService;

    /**
     * Lấy danh sách nhân viên với bộ lọc và phân trang
     * 
     * @param page Số trang (bắt đầu từ 0)
     * @param size Số lượng nhân viên mỗi trang
     * @param status Trạng thái nhân viên (active, inactive, on_leave)
     * @param search Từ khóa tìm kiếm (tìm theo username, full_name, email, phone_number)
     * @param roleId ID vai trò (nếu muốn lọc theo vai trò)
     * @return Danh sách nhân viên với thông tin phân trang
     */
    @GetMapping("/employees")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer roleId) {
        
        try {
            Map<String, Object> response = employeeManagementService.getEmployees(page, size, status, search, roleId);
            
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy danh sách nhân viên thành công",
                    response
                )
            );
        } catch (Exception e) {
            // Log the exception for debugging
            e.printStackTrace();
            
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi lấy danh sách nhân viên: " + e.getMessage(),
                    null
                )
            );
        }
    }

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<EmployeeListResponse>> getEmployeeById(@PathVariable Long employeeId) {
        try {
            EmployeeListResponse employee = employeeManagementService.getEmployeeById(employeeId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, "Lấy thông tin nhân viên thành công", employee));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(ApiResponseStatus.NOT_FOUND_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, "Lỗi khi lấy thông tin nhân viên: " + e.getMessage(), null));
        }
    }
    
    /**
     * Tạo mới nhân viên
     */
    @PostMapping("/employees")
    public ResponseEntity<ApiResponse<Integer>> createEmployee(@Valid @RequestBody EmployeeRegisterRequest request) {
        try {
            Integer employeeId = employeeManagementService.createEmployee(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Tạo nhân viên thành công",
                    employeeId
                )
            );
        } catch (InvalidRequestException | DuplicateResourceException e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi tạo nhân viên: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Cập nhật thông tin nhân viên
     */
    @PutMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<String>> updateEmployee(
            @PathVariable Long employeeId,
            @Valid @RequestBody EmployeeUpdateRequest request) {
        try {
            employeeManagementService.updateEmployee(employeeId, request);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Cập nhật thông tin nhân viên thành công",
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (InvalidRequestException | DuplicateResourceException e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi cập nhật thông tin nhân viên: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    // Các endpoint riêng biệt cho việc thay đổi trạng thái đã được gộp vào endpoint cập nhật (PUT /employees/{employeeId})
    // Sử dụng trường status trong EmployeeUpdateRequest để thay đổi trạng thái nhân viên
    
    /**
     * Xóa nhân viên vĩnh viễn khỏi cơ sở dữ liệu (hard delete)
     */
    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<String>> permanentDeleteEmployee(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "false") boolean force) {
        try {
            employeeManagementService.permanentDeleteEmployee(employeeId, force);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Xóa vĩnh viễn nhân viên thành công",
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (InvalidRequestException e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi xóa vĩnh viễn nhân viên: " + e.getMessage(),
                    null
                )
            );
        }
    }
}
