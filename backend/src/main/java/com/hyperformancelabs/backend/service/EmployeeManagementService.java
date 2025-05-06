package com.hyperformancelabs.backend.service;

import java.util.Map;
import com.hyperformancelabs.backend.dto.EmployeeListResponse;

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
}
