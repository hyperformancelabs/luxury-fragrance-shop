package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.dto.EmployeeLoginRequest;
import com.hyperformancelabs.backend.dto.LoginResponse;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.InvalidRequestException;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.service.EmployeeService;
import com.hyperformancelabs.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public void registerEmployee(EmployeeRegisterRequest request) {
        // Validate request
        validateRequest(request);

        // Tạo mới Employee
        Employee employee = new Employee();
        mapRequestToEntity(request, employee);
        employee.setStatus("active"); // Mặc định là active

        // Lưu vào database
        employeeRepository.save(employee);
    }

    private void validateRequest(EmployeeRegisterRequest request) {
        // Kiểm tra các trường bắt buộc
        if (!StringUtils.hasText(request.getUsername())) {
            throw new InvalidRequestException("Username is required");
        }
        if (!StringUtils.hasText(request.getPassword())) {
            throw new InvalidRequestException("Password is required");
        }
        if (!StringUtils.hasText(request.getFullName())) {
            throw new InvalidRequestException("Full name is required");
        }
        if (!StringUtils.hasText(request.getPhoneNumber())) {
            throw new InvalidRequestException("Phone number is required");
        }
        if (!StringUtils.hasText(request.getAddress())) {
            throw new InvalidRequestException("Address is required");
        }

        // Validate email format nếu có
        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new InvalidRequestException("Invalid email format");
        }

        // Kiểm tra username đã tồn tại
        if (employeeRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        // Kiểm tra email đã tồn tại nếu có
        if (StringUtils.hasText(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
    }

    private void mapRequestToEntity(EmployeeRegisterRequest request, Employee employee) {
        employee.setUsername(request.getUsername());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setFullName(request.getFullName());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setEmail(StringUtils.hasText(request.getEmail()) ? request.getEmail() : null);
        employee.setAddress(request.getAddress());
        employee.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setProfilePictureUrl(StringUtils.hasText(request.getProfilePictureUrl()) ? 
                                    request.getProfilePictureUrl() : null);
    }

    @Override
    @Transactional
    public LoginResponse login(EmployeeLoginRequest request) {
        Employee emp = employeeRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
        if (!passwordEncoder.matches(request.getPassword(), emp.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        if (!"active".equalsIgnoreCase(emp.getStatus())) {
            throw new RuntimeException("Tài khoản không hoạt động");
        }
        emp.setLastLogin(LocalDateTime.now());
        employeeRepository.save(emp);
        String token = jwtUtil.generateToken(request.getUsername());
        var roles = emp.getEmployeeRoles().stream()
            .map(er -> er.getRole().getRoleName())
            .collect(Collectors.toList());
        return new LoginResponse(token, emp.getEmployeeId().longValue(), emp.getUsername(), emp.getEmail(), roles);
    }
}