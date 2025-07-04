package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.PermissionResponse;
import java.util.List;
import java.util.Map;

public interface PermissionService {
    /**
     * Lấy danh sách quyền với phân trang
     */
    Map<String, Object> getPermissions(int page, int size);

    /**
     * Lấy tất cả quyền
     */
    List<PermissionResponse> getAllPermissions();

    /**
     * Lấy quyền theo ID
     */
    PermissionResponse getPermissionById(Integer permissionId);

    /**
     * Lấy quyền theo vai trò
     */
    List<PermissionResponse> getPermissionsByRole(Integer roleId);

    /**
     * Lấy quyền chưa được gán cho vai trò
     */
    List<PermissionResponse> getAvailablePermissionsByRole(Integer roleId);
}
