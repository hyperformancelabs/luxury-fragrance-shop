package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestVerificationCodeRequest {
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @NotNull(message = "Loại người dùng không được để trống")
    private String userType; // EMPLOYEE hoặc CUSTOMER
    
    private Integer userId; // Có thể null nếu chưa có tài khoản
}
