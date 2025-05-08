package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.EmployeeListResponse;
import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.dto.EmployeeUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.InvalidRequestException;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.repository.RoleRepository;
import com.hyperformancelabs.backend.repository.EmployeeRoleRepository;
import com.hyperformancelabs.backend.model.Role;
import com.hyperformancelabs.backend.model.EmployeeRole;
import com.hyperformancelabs.backend.service.EmployeeManagementService;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EmployeeManagementServiceImpl implements EmployeeManagementService {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final EmployeeRoleRepository employeeRoleRepository;
    private final PasswordEncoder passwordEncoder;
    
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
    
    @Override
    @Transactional
    public Integer createEmployee(EmployeeRegisterRequest request) {
        // Validate request
        validateEmployeeRequest(request);

        // Create new Employee
        Employee employee = new Employee();
        mapRegisterRequestToEntity(request, employee);
        employee.setStatus("active"); // Default is active

        // Save to database
        Employee savedEmployee = employeeRepository.save(employee);
        return savedEmployee.getEmployeeId();
    }
    
    @Override
    @Transactional
    public void updateEmployee(Long employeeId, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(employeeId.intValue())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        // Update employee information
        if (StringUtils.hasText(request.getFullName())) {
            employee.setFullName(request.getFullName());
        }
        
        if (StringUtils.hasText(request.getPhoneNumber())) {
            employee.setPhoneNumber(request.getPhoneNumber());
        }
        
        if (request.getEmail() != null) {
            // Check if email already exists for another employee
            if (StringUtils.hasText(request.getEmail()) && 
                !request.getEmail().equals(employee.getEmail()) && 
                employeeRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Email already exists");
            }
            employee.setEmail(StringUtils.hasText(request.getEmail()) ? request.getEmail() : null);
        }
        
        if (StringUtils.hasText(request.getAddress())) {
            employee.setAddress(request.getAddress());
        }
        
        if (request.getDateOfBirth() != null) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        
        if (request.getProfilePictureUrl() != null) {
            employee.setProfilePictureUrl(StringUtils.hasText(request.getProfilePictureUrl()) ? 
                                        request.getProfilePictureUrl() : null);
        }
        
        // Cập nhật trạng thái nếu được cung cấp
        if (StringUtils.hasText(request.getStatus())) {
            // Kiểm tra trạng thái hợp lệ
            if (!"active".equals(request.getStatus()) && 
                !"inactive".equals(request.getStatus()) && 
                !"on_leave".equals(request.getStatus())) {
                throw new InvalidRequestException("Trạng thái không hợp lệ. Các giá trị hợp lệ: active, inactive, on_leave");
            }
            employee.setStatus(request.getStatus());
        }
        
        // Handle password change if requested
        if (StringUtils.hasText(request.getCurrentPassword()) && StringUtils.hasText(request.getNewPassword())) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), employee.getPassword())) {
                throw new InvalidRequestException("Current password is incorrect");
            }
            employee.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        
        // Save updated employee
        employeeRepository.save(employee);
    }
    
    @Override
    @Transactional
    public void assignRolesToEmployee(Long employeeId, List<Integer> roleIds) {
        Employee employee = employeeRepository.findById(employeeId.intValue())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        for (Integer roleId : roleIds) {
            Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
            Optional<EmployeeRole> existing = employeeRoleRepository.findByEmployeeAndRole(employee, role);
            if (existing.isEmpty()) {
                EmployeeRole er = new EmployeeRole();
                er.setEmployee(employee);
                er.setRole(role);
                er.setStatus("active");
                employeeRoleRepository.save(er);
            }
        }
    }

    @Override
    @Transactional
    public void removeRolesFromEmployee(Long employeeId, List<Integer> roleIds) {
        Employee employee = employeeRepository.findById(employeeId.intValue())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        for (Integer roleId : roleIds) {
            Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
            employeeRoleRepository.findByEmployeeAndRole(employee, role)
                .ifPresent(er -> employeeRoleRepository.delete(er));
        }
    }
    
    @Override
    @Transactional
    public void updateEmployeeRoles(Long employeeId, List<Integer> roleIds) {
        Employee employee = employeeRepository.findById(employeeId.intValue())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        // Lấy danh sách vai trò hiện tại của nhân viên từ repository
        List<EmployeeRole> empRoles = employeeRoleRepository.findAllByEmployee(employee);
        List<Role> currentRoles = empRoles.stream()
            .map(EmployeeRole::getRole)
            .collect(Collectors.toList());
        
        // Danh sách vai trò cần thêm (có trong roleIds nhưng không có trong currentRoles)
        List<Integer> rolesToAdd = roleIds.stream()
            .filter(roleId -> currentRoles.stream()
                .noneMatch(role -> role.getRoleId().equals(roleId)))
            .collect(Collectors.toList());
        
        // Danh sách vai trò cần xóa (có trong currentRoles nhưng không có trong roleIds)
        List<Integer> rolesToRemove = currentRoles.stream()
            .map(Role::getRoleId)
            .filter(roleId -> !roleIds.contains(roleId))
            .collect(Collectors.toList());
        
        // Xóa các vai trò cũ
        if (!rolesToRemove.isEmpty()) {
            removeRolesFromEmployee(employeeId, rolesToRemove);
        }
        
        // Thêm các vai trò mới
        if (!rolesToAdd.isEmpty()) {
            assignRolesToEmployee(employeeId, rolesToAdd);
        }
    }
    
    // Các phương thức deactivateEmployee và reactivateEmployee đã được gộp vào phương thức updateEmployee
    // Sử dụng trường status trong EmployeeUpdateRequest để thay đổi trạng thái nhân viên
    
    @Override
    @Transactional
    public void permanentDeleteEmployee(Long employeeId, boolean force) {
        Employee employee = employeeRepository.findById(employeeId.intValue())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        // Check for related data that would be affected by deletion
        if (!force) {
            // Check for orders associated with this employee
            if (!employee.getOrders().isEmpty()) {
                throw new InvalidRequestException("Cannot delete employee with associated orders. Use force=true to override or deactivate instead.");
            }
            
            // Check for inventory transactions associated with this employee
            if (!employee.getInventoryTransactions().isEmpty()) {
                throw new InvalidRequestException("Cannot delete employee with associated inventory transactions. Use force=true to override or deactivate instead.");
            }
            
            // Check for material transactions associated with this employee
            if (!employee.getMaterialTransactions().isEmpty()) {
                throw new InvalidRequestException("Cannot delete employee with associated material transactions. Use force=true to override or deactivate instead.");
            }
        }
        
        // Delete employee roles first (cascade would handle this, but doing it explicitly for clarity)
        if (employee.getEmployeeRoles() != null && !employee.getEmployeeRoles().isEmpty()) {
            System.out.println("Deleting " + employee.getEmployeeRoles().size() + " employee roles for employee ID " + employeeId);
        }
        
        // Perform the actual deletion
        employeeRepository.delete(employee);
        System.out.println("Employee with ID " + employeeId + " has been permanently deleted");
    }
    
    private void validateEmployeeRequest(EmployeeRegisterRequest request) {
        // Check required fields
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

        // Validate email format if provided
        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new InvalidRequestException("Invalid email format");
        }

        // Check if username already exists
        if (employeeRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        // Check if email already exists if provided
        if (StringUtils.hasText(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
    }

    private void mapRegisterRequestToEntity(EmployeeRegisterRequest request, Employee employee) {
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
