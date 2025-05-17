package com.hyperformancelabs.backend.util;

import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Lấy thông tin username (username của nhân viên) từ JWT token hiện tại
     *
     * @return Username của nhân viên đang đăng nhập
     */
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    /**
     * Lấy ID của nhân viên hiện tại từ JWT token
     *
     * @return ID của nhân viên đang đăng nhập
     * @throws ResourceNotFoundException nếu không tìm thấy nhân viên
     */
    public Integer getCurrentEmployeeId() {
        String username = getCurrentUsername();
        if (username == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin người dùng hiện tại");
        }
        
        Employee employee = employeeRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với username: " + username));
        
        return employee.getEmployeeId();
    }
    
    /**
     * Lấy thông tin nhân viên hiện tại từ JWT token
     *
     * @return Đối tượng Employee của nhân viên đang đăng nhập
     * @throws ResourceNotFoundException nếu không tìm thấy nhân viên
     */
    public Employee getCurrentEmployee() {
        String username = getCurrentUsername();
        if (username == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin người dùng hiện tại");
        }
        
        return employeeRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với username: " + username));
    }
} 