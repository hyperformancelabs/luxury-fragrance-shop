package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;

public interface EmployeeService {
    void registerEmployee(EmployeeRegisterRequest request);
}
