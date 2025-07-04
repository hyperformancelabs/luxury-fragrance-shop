package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RolePermissionRequest {
    @NotNull(message = "Danh sách permissionIds không được để trống")
    @NotEmpty(message = "Phải có ít nhất một permissionId")
    private List<Integer> permissionIds;
}
