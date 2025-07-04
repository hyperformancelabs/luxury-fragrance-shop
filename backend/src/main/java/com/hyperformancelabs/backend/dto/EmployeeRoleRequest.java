package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class EmployeeRoleRequest {
    @NotNull(message = "Danh sách roleIds không được để trống")
    @NotEmpty(message = "Phải có ít nhất một roleId")
    private List<Integer> roleIds;
}
