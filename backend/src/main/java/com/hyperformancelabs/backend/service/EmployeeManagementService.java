package com.hyperformancelabs.backend.service;

import java.util.List;
import java.util.Map;
import com.hyperformancelabs.backend.dto.EmployeeListResponse;
import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.dto.EmployeeUpdateRequest;

public interface EmployeeManagementService {
    /**
     * Lấy danh sách nhân viên với bộ lọc và phân trang
     * 
     * @param page Số trang (bắt đầu từ 0)
     * @param size Số lượng nhân viên mỗi trang
     * @param status Trạng thái nhân viên (active, inactive, on_leave)
     * @param search Từ khóa tìm kiếm (tìm theo username, full_name, email, phone_number)
     * @param roleId ID vai trò (nếu muốn lọc theo vai trò)
     * @return Map chứa danh sách nhân viên và thông tin phân trang
     */
    Map<String, Object> getEmployees(int page, int size, String status, String search, Integer roleId);
    EmployeeListResponse getEmployeeById(Long employeeId);
    
    /**
     * Tạo mới nhân viên
     * 
     * @param request Thông tin nhân viên cần tạo
     * @return ID của nhân viên vừa tạo
     */
    Integer createEmployee(EmployeeRegisterRequest request);
    
    /**
     * Cập nhật thông tin nhân viên
     * 
     * @param employeeId ID của nhân viên cần cập nhật
     * @param request Thông tin cập nhật (bao gồm cả trạng thái nếu muốn thay đổi)
     */
    void updateEmployee(Long employeeId, EmployeeUpdateRequest request);
    
    /**
     * Xóa nhân viên vĩnh viễn khỏi cơ sở dữ liệu (hard delete)
     * 
     * @param employeeId ID của nhân viên cần xóa vĩnh viễn
     * @param force Nếu true, bắt buộc xóa ngay cả khi có dữ liệu liên quan
     */
    void permanentDeleteEmployee(Long employeeId, boolean force);
    
    /**
     * Gán vai trò cho nhân viên
     * 
     * @param employeeId ID của nhân viên cần gán vai trò
     * @param roleIds Danh sách ID vai trò cần gán
     */
    void assignRolesToEmployee(Long employeeId, List<Integer> roleIds);
    
    /**
     * Xóa vai trò khỏi nhân viên
     * 
     * @param employeeId ID của nhân viên cần xóa vai trò
     * @param roleIds Danh sách ID vai trò cần xóa
     */
    void removeRolesFromEmployee(Long employeeId, List<Integer> roleIds);
    
    /**
     * Cập nhật toàn bộ vai trò của nhân viên
     * 
     * @param employeeId ID của nhân viên cần cập nhật vai trò
     * @param roleIds Danh sách ID vai trò mới (sẽ thay thế hoàn toàn danh sách cũ)
     */
    void updateEmployeeRoles(Long employeeId, List<Integer> roleIds);
}
