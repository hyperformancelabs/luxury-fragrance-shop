package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ApiResponse;
import com.hyperformancelabs.backend.dto.ApiResponseStatus;
import com.hyperformancelabs.backend.dto.ResetPasswordRequest;
import com.hyperformancelabs.backend.exception.InvalidRequestException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.model.VerificationCode;
import com.hyperformancelabs.backend.model.enums.UserType;
import com.hyperformancelabs.backend.model.enums.VerificationType;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.service.VerificationService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {
    
    private final VerificationService verificationService;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    
    public PasswordResetController(
            VerificationService verificationService,
            EmployeeRepository employeeRepository,
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder) {
        this.verificationService = verificationService;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    /**
     * Đặt lại mật khẩu bằng mã xác thực
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            // Validate password confirmation
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                throw new InvalidRequestException("Mật khẩu xác nhận không khớp");
            }
            
            // Verify code
            Optional<VerificationCode> verificationCodeOpt = verificationService.verifyCode(
                    request.getCode(), VerificationType.PASSWORD_RESET);
            
            if (verificationCodeOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                        ApiResponseStatus.BAD_REQUEST_CODE,
                        ApiResponseStatus.ERROR_STATUS,
                        "Mã xác thực không hợp lệ hoặc đã hết hạn",
                        null
                    )
                );
            }
            
            VerificationCode verificationCode = verificationCodeOpt.get();
            
            // Check if the email matches
            if (!verificationCode.getEmail().equals(request.getEmail())) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                        ApiResponseStatus.BAD_REQUEST_CODE,
                        ApiResponseStatus.ERROR_STATUS,
                        "Mã xác thực không hợp lệ cho email này",
                        null
                    )
                );
            }
            
            // Update password based on user type
            String userType = verificationCode.getUserType();
            
            if (UserType.EMPLOYEE.getValue().equals(userType)) {
                // Find employee by email
                Optional<Employee> employeeOpt = employeeRepository.findByEmail(request.getEmail());
                
                if (employeeOpt.isEmpty()) {
                    throw new ResourceNotFoundException("Không tìm thấy nhân viên với email: " + request.getEmail());
                }
                
                // Get employee ID first
                Integer employeeId = employeeOpt.get().getEmployeeId();
                
                // Fetch the employee again with a fresh session to ensure all relationships are loaded
                Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + employeeId));
                
                // Update password
                employee.setPassword(passwordEncoder.encode(request.getNewPassword()));
                
                // Save the employee
                employeeRepository.save(employee);
            } else if (UserType.CUSTOMER.getValue().equals(userType)) {
                // Find customer by email
                Optional<Customer> customerOpt = customerRepository.findByEmail(request.getEmail());
                
                if (customerOpt.isEmpty()) {
                    throw new ResourceNotFoundException("Không tìm thấy khách hàng với email: " + request.getEmail());
                }
                
                // Get customer ID first
                Integer customerId = customerOpt.get().getCustomerId();
                
                // Fetch the customer again with a fresh session to ensure all relationships are loaded
                Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng với ID: " + customerId));
                
                // Update password
                customer.setPassword(passwordEncoder.encode(request.getNewPassword()));
                
                // Save the customer
                customerRepository.save(customer);
            } else {
                throw new InvalidRequestException("Loại người dùng không hợp lệ");
            }
            
            // Mark verification code as used
            verificationService.markCodeAsUsed(verificationCode.getId());
            
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Đặt lại mật khẩu thành công",
                    null
                )
            );
        } catch (InvalidRequestException e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi đặt lại mật khẩu: " + e.getMessage(),
                    null
                )
            );
        }
    }
}
