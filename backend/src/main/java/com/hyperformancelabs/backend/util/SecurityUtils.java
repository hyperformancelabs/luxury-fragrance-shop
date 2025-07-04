package com.hyperformancelabs.backend.util;

import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private static final Logger logger = LoggerFactory.getLogger(SecurityUtils.class);
    
    // Default system admin employee ID to use when no authenticated user is present
    private static final Integer SYSTEM_ADMIN_ID = 1;

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
     * Kiểm tra xem người dùng hiện tại có phải là anonymous user không
     * 
     * @return true nếu là anonymous user, false nếu đã đăng nhập
     */
    public boolean isAnonymousUser() {
        String username = getCurrentUsername();
        return username == null || "anonymousUser".equals(username);
    }

    /**
     * Lấy ID của nhân viên hiện tại từ JWT token
     * Nếu là anonymous user, trả về ID của system admin (1)
     *
     * @return ID của nhân viên đang đăng nhập hoặc system admin ID nếu là anonymous
     * @throws ResourceNotFoundException nếu không tìm thấy nhân viên
     */
    public Integer getCurrentEmployeeId() {
        String username = getCurrentUsername();
        
        // Nếu không có username hoặc là anonymousUser, sử dụng system admin ID
        if (username == null || "anonymousUser".equals(username)) {
            logger.info("Anonymous user detected, using system admin ID: {}", SYSTEM_ADMIN_ID);
            return SYSTEM_ADMIN_ID;
        }
        
        try {
            Employee employee = employeeRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với username: " + username));
            
            return employee.getEmployeeId();
        } catch (Exception e) {
            logger.warn("Error getting employee ID for username: {}, falling back to system admin ID", username, e);
            return SYSTEM_ADMIN_ID;
        }
    }
    
    /**
     * Lấy thông tin nhân viên hiện tại từ JWT token
     * Nếu là anonymous user, trả về system admin
     *
     * @return Đối tượng Employee của nhân viên đang đăng nhập hoặc system admin nếu là anonymous
     * @throws ResourceNotFoundException nếu không tìm thấy nhân viên
     */
    public Employee getCurrentEmployee() {
        String username = getCurrentUsername();
        
        // Nếu không có username hoặc là anonymousUser, sử dụng system admin
        if (username == null || "anonymousUser".equals(username)) {
            logger.info("Anonymous user detected, using system admin");
            return employeeRepository.findById(SYSTEM_ADMIN_ID)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy system admin với ID: " + SYSTEM_ADMIN_ID));
        }
        
        try {
            return employeeRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với username: " + username));
        } catch (Exception e) {
            logger.warn("Error getting employee for username: {}, falling back to system admin", username, e);
            return employeeRepository.findById(SYSTEM_ADMIN_ID)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy system admin với ID: " + SYSTEM_ADMIN_ID));
        }
    }
} 