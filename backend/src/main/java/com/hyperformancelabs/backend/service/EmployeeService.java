package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.dto.LoginResponse;
import com.hyperformancelabs.backend.dto.EmployeeLoginRequest;

public interface EmployeeService {
    void registerEmployee(EmployeeRegisterRequest request);
    LoginResponse login(EmployeeLoginRequest request);
}
