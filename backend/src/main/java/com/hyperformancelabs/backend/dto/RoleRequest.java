package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoleRequest {
    @NotBlank(message = "Tên vai trò không được để trống")
    @Size(min = 2, max = 50, message = "Tên vai trò phải từ 2-50 ký tự")
    private String roleName;
    
    private String roleDescription;
    
    private Boolean isDefault;
    
    @NotBlank(message = "Trạng thái không được để trống")
    private String status;
}
