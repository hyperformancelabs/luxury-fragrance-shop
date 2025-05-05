package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.EmployeeProfileResponse;
import com.hyperformancelabs.backend.dto.EmployeeUpdateRequest;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<EmployeeProfileResponse>> getEmployeeProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        try {
            EmployeeProfileResponse profile = employeeService.getEmployeeProfile(username);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy thông tin nhân viên thành công",
                    profile
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<EmployeeProfileResponse>> updateEmployeeProfile(
            @Valid @RequestBody EmployeeUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        try {
            EmployeeProfileResponse updatedProfile = employeeService.updateEmployeeProfile(username, request);
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Cập nhật thông tin nhân viên thành công",
                    updatedProfile
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        }
    }
}
