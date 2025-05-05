package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.dto.LoginResponse;
import com.hyperformancelabs.backend.dto.EmployeeLoginRequest;
import com.hyperformancelabs.backend.dto.EmployeeProfileResponse;
import com.hyperformancelabs.backend.dto.EmployeeUpdateRequest;

public interface EmployeeService {
    void registerEmployee(EmployeeRegisterRequest request);
    LoginResponse login(EmployeeLoginRequest request);
    EmployeeProfileResponse getEmployeeProfile(String username);
    EmployeeProfileResponse updateEmployeeProfile(String username, EmployeeUpdateRequest request);
}
