package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyCodeRequest {
    
    @NotBlank(message = "Mã xác thực không được để trống")
    private String code;
    
    @NotBlank(message = "Email không được để trống")
    private String email;
}
