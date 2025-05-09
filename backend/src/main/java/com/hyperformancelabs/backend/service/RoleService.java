package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.RoleRequest;
import com.hyperformancelabs.backend.dto.RoleResponse;

import java.util.List;
import java.util.Map;

public interface RoleService {
    /**
     * Lấy danh sách vai trò với phân trang
     * 
     * @param page Số trang (bắt đầu từ 0)
     * @param size Số lượng vai trò mỗi trang
     * @param search Từ khóa tìm kiếm (tìm theo tên vai trò)
     * @return Map chứa danh sách vai trò và thông tin phân trang
     */
    Map<String, Object> getRoles(int page, int size, String search);
    
    /**
     * Lấy tất cả vai trò
     * 
     * @return Danh sách tất cả vai trò
     */
    List<RoleResponse> getAllRoles();
    
    /**
     * Lấy tất cả vai trò đang hoạt động
     * 
     * @return Danh sách vai trò đang hoạt động
     */
    List<RoleResponse> getActiveRoles();
    
    /**
     * Lấy vai trò theo ID
     * 
     * @param roleId ID của vai trò cần lấy
     * @return Thông tin vai trò
     */
    RoleResponse getRoleById(Integer roleId);
    
    /**
     * Lấy danh sách vai trò kèm số lượng nhân viên
     * 
     * @return Danh sách vai trò với số lượng nhân viên
     */
    List<Map<String, Object>> getRolesWithEmployeeCount();
    
    /**
     * Tạo vai trò mới
     * 
     * @param request Thông tin vai trò cần tạo
     * @return ID của vai trò vừa tạo
     */
    Integer createRole(RoleRequest request);
    
    /**
     * Cập nhật vai trò
     * 
     * @param roleId ID của vai trò cần cập nhật
     * @param request Thông tin cập nhật
     */
    void updateRole(Integer roleId, RoleRequest request);
    
    /**
     * Xóa vai trò
     * 
     * @param roleId ID của vai trò cần xóa
     * @param force Nếu true, bắt buộc xóa ngay cả khi có dữ liệu liên quan
     */
    void deleteRole(Integer roleId, boolean force);
    
    /**
     * Thêm quyền cho vai trò
     * @param roleId ID vai trò
     * @param permissionIds Danh sách ID quyền
     */
    void addPermissionsToRole(Integer roleId, List<Integer> permissionIds);
    
    /**
     * Xóa quyền khỏi vai trò
     * @param roleId ID vai trò
     * @param permissionIds Danh sách ID quyền
     */
    void removePermissionsFromRole(Integer roleId, List<Integer> permissionIds);
    
    /**
     * Đặt vai trò làm mặc định
     * @param roleId ID vai trò
     */
    void setDefaultRole(Integer roleId);
}
