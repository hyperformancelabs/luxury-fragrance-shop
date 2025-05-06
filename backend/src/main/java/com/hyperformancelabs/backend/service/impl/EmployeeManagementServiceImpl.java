package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.EmployeeListResponse;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.service.EmployeeManagementService;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeManagementServiceImpl implements EmployeeManagementService {

    private final EmployeeRepository employeeRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getEmployees(int page, int size, String status, String search, Integer roleId) {
        try {
            System.out.println("Starting getEmployees method with parameters: page=" + page + ", size=" + size + ", status=" + status + ", search=" + search + ", roleId=" + roleId);
            
            // Sử dụng cách đơn giản hơn với Spring Data JPA để kiểm tra lỗi
            // Lấy tất cả nhân viên từ repository
            List<Employee> allEmployees = employeeRepository.findAll();
            System.out.println("Found " + allEmployees.size() + " employees in total");
            
            // Lọc theo status nếu có
            if (StringUtils.hasText(status)) {
                allEmployees = allEmployees.stream()
                    .filter(e -> status.equals(e.getStatus()))
                    .collect(Collectors.toList());
                System.out.println("After status filter: " + allEmployees.size() + " employees");
            }
            
            // Tìm kiếm theo từ khóa nếu có
            if (StringUtils.hasText(search)) {
                String searchLower = search.toLowerCase();
                allEmployees = allEmployees.stream()
                    .filter(e -> 
                        (e.getUsername() != null && e.getUsername().toLowerCase().contains(searchLower)) ||
                        (e.getFullName() != null && e.getFullName().toLowerCase().contains(searchLower)) ||
                        (e.getEmail() != null && e.getEmail().toLowerCase().contains(searchLower)) ||
                        (e.getPhoneNumber() != null && e.getPhoneNumber().toLowerCase().contains(searchLower))
                    )
                    .collect(Collectors.toList());
                System.out.println("After search filter: " + allEmployees.size() + " employees");
            }
            
            // Lọc theo roleId nếu có
            if (roleId != null) {
                allEmployees = allEmployees.stream()
                    .filter(e -> e.getEmployeeRoles().stream()
                        .anyMatch(er -> er.getRole().getRoleId().equals(roleId)))
                    .collect(Collectors.toList());
                System.out.println("After role filter: " + allEmployees.size() + " employees");
            }
            
            // Sắp xếp theo employeeId giảm dần (nhân viên mới nhất trước)
            allEmployees.sort((e1, e2) -> e2.getEmployeeId().compareTo(e1.getEmployeeId()));
            
            // Tính toán phân trang
            int totalItems = allEmployees.size();
            int totalPages = (int) Math.ceil((double) totalItems / size);
            
            // Áp dụng phân trang
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalItems);
            
            List<Employee> pagedEmployees;
            if (startIndex < totalItems) {
                pagedEmployees = allEmployees.subList(startIndex, endIndex);
            } else {
                pagedEmployees = new ArrayList<>();
            }
            
            System.out.println("After pagination: " + pagedEmployees.size() + " employees");
            
            // Chuyển đổi kết quả sang DTO
            List<EmployeeListResponse> employeeResponses = new ArrayList<>();
            for (Employee employee : pagedEmployees) {
                try {
                    // No need to initialize roles here as we fetch them directly in mapToEmployeeListResponse
                    
                    EmployeeListResponse dto = mapToEmployeeListResponse(employee);
                    employeeResponses.add(dto);
                } catch (Exception e) {
                    System.err.println("Error mapping employee to DTO: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            // Tạo kết quả trả về
            Map<String, Object> response = new HashMap<>();
            response.put("employees", employeeResponses);
            response.put("currentPage", page);
            response.put("totalItems", totalItems);
            response.put("totalPages", totalPages);
            
            System.out.println("Successfully completed getEmployees method");
            return response;
        } catch (Exception e) {
            System.err.println("Error in getEmployees method: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lấy danh sách nhân viên: " + e.getMessage(), e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public EmployeeListResponse getEmployeeById(Long employeeId) {
        try {
            System.out.println("Fetching employee with ID: " + employeeId);
            Employee employee = employeeRepository.findById(employeeId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
            
            // No need to initialize roles here as we fetch them directly in mapToEmployeeListResponse
            
            System.out.println("Successfully fetched employee with ID: " + employeeId);
            return mapToEmployeeListResponse(employee);
        } catch (Exception e) {
            System.err.println("Error fetching employee with ID " + employeeId + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    private EmployeeListResponse mapToEmployeeListResponse(Employee employee) {
        // Fetch role names directly using the repository method
        List<String> roles;
        try {
            roles = employeeRepository.findRoleNamesByEmployeeId(employee.getEmployeeId());
            System.out.println("Found " + roles.size() + " roles for employee ID " + employee.getEmployeeId());
        } catch (Exception e) {
            System.err.println("Error fetching roles for employee ID " + employee.getEmployeeId() + ": " + e.getMessage());
            e.printStackTrace();
            roles = new ArrayList<>();
        }
        
        return new EmployeeListResponse(
                employee.getEmployeeId().longValue(),
                employee.getUsername(),
                employee.getFullName(),
                employee.getPhoneNumber(),
                employee.getEmail(),
                employee.getAddress(),
                employee.getStatus(),
                employee.getStartDate(),
                employee.getLastLogin(),
                employee.getDateOfBirth(),
                employee.getProfilePictureUrl(),
                roles
        );
    }
}
