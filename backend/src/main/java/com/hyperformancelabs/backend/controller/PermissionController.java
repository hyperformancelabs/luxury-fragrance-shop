package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.PermissionResponse;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emp/permissions")
public class PermissionController {
    @Autowired
    private PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPermissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> resp = permissionService.getPermissions(page, size);
        return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Lấy danh sách quyền thành công",
                resp
        ));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAllPermissions() {
        List<PermissionResponse> list = permissionService.getAllPermissions();
        return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Lấy tất cả quyền thành công",
                list
        ));
    }

    @GetMapping("/{permissionId}")
    public ResponseEntity<ApiResponse<PermissionResponse>> getPermissionById(@PathVariable Integer permissionId) {
        try {
            PermissionResponse pr = permissionService.getPermissionById(permissionId);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy quyền thành công",
                    pr
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(
                            ApiResponseStatus.NOT_FOUND_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(), null
                    ));
        }
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getPermissionsByRole(@PathVariable Integer roleId) {
        try {
            List<PermissionResponse> list = permissionService.getPermissionsByRole(roleId);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy quyền theo vai trò thành công",
                    list
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(
                            ApiResponseStatus.NOT_FOUND_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(), null
                    ));
        }
    }

    @GetMapping("/role/{roleId}/available")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAvailablePermissions(@PathVariable Integer roleId) {
        try {
            List<PermissionResponse> list = permissionService.getAvailablePermissionsByRole(roleId);
            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Lấy quyền chưa gán thành công",
                    list
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(
                            ApiResponseStatus.NOT_FOUND_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(), null
                    ));
        }
    }
}
