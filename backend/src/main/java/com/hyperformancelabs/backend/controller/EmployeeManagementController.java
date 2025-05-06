package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.EmployeeListResponse;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.EmployeeManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;

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
}
