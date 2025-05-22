package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.*;

import java.util.List;

public interface EmployeeService {
//    void registerEmployee(EmployeeRegisterRequest request);
//    LoginResponse login(EmployeeLoginRequest request);
//    EmployeeProfileResponse getEmployeeProfile(String username);
//    EmployeeProfileResponse updateEmployeeProfile(String username, EmployeeUpdateRequest request);

    // Lấy system admin theo email hoặc số điện thoại
    EmployeeDTO findActiveSystemAdminByEmailOrPhone(String emailOrPhone);

    // Lấy thông tin nhân viên theo username
    EmployeeDTO getEmployeeByUsername(String username);

    // Lấy role của nhân viên theo id
    List<String> findActiveRoleNamesByEmployeeId(Integer employeeId);
}
