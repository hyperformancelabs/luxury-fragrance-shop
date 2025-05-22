package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.EmployeeDTO;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public EmployeeDTO findActiveSystemAdminByEmailOrPhone(String emailOrPhone) {
        Employee employee = employeeRepository.findActiveSystemAdminByEmailOrPhone(emailOrPhone);
        return employee != null ? convertToEmployeeDTO(employee) : null;
    }

    @Override
    public EmployeeDTO getEmployeeByUsername(String username) {
        return employeeRepository.findByUsername(username)
                .map(this::convertToEmployeeDTO)
                .orElse(null);
    }

    @Override
    public List<String> findActiveRoleNamesByEmployeeId(Integer employeeId) {
        return employeeRepository.findActiveRoleNamesByEmployeeId(employeeId);
    }

    private EmployeeDTO convertToEmployeeDTO(Employee employee) {
        return new EmployeeDTO(
                employee.getEmployeeId(),
                employee.getUsername(),
                employee.getPassword(),
                employee.getFullName(),
                employee.getPhoneNumber(),
                employee.getEmail(),
                employee.getAddress(),
                employee.getStatus(),
                employee.getStartDate(),
                employee.getLastLogin(),
                employee.getDateOfBirth(),
                employee.getProfilePictureUrl()
        );
    }
}
