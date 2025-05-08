package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.RoleRequest;
import com.hyperformancelabs.backend.dto.RoleResponse;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.InvalidRequestException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Permission;
import com.hyperformancelabs.backend.model.Role;
import com.hyperformancelabs.backend.model.RolePermission;
import com.hyperformancelabs.backend.repository.PermissionRepository;
import com.hyperformancelabs.backend.repository.RolePermissionRepository;
import com.hyperformancelabs.backend.repository.RoleRepository;
import com.hyperformancelabs.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getRoles(int page, int size, String search) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("roleName").ascending());
            
            Page<Role> rolePage;
            if (StringUtils.hasText(search)) {
                // Tìm kiếm theo tên vai trò (cần triển khai phương thức tìm kiếm)
                // Đây là cách đơn giản, có thể cải thiện bằng cách sử dụng Specification hoặc Query method
                List<Role> allRoles = roleRepository.findAll();
                List<Role> filteredRoles = allRoles.stream()
                    .filter(role -> role.getRoleName().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
                
                // Thực hiện phân trang thủ công
                int start = (int) pageable.getOffset();
                int end = Math.min((start + pageable.getPageSize()), filteredRoles.size());
                
                List<Role> pageContent = start < end ? 
                    filteredRoles.subList(start, end) : 
                    new ArrayList<>();
                
                rolePage = new org.springframework.data.domain.PageImpl<>(
                    pageContent, pageable, filteredRoles.size());
            } else {
                rolePage = roleRepository.findAll(pageable);
            }
            
            List<RoleResponse> roleResponses = rolePage.getContent().stream()
                .map(this::mapToRoleResponse)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("roles", roleResponses);
            response.put("currentPage", rolePage.getNumber());
            response.put("totalItems", rolePage.getTotalElements());
            response.put("totalPages", rolePage.getTotalPages());
            
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lấy danh sách vai trò: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAllByOrderByRoleNameAsc().stream()
            .map(this::mapToRoleResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getActiveRoles() {
        return roleRepository.findAllByStatusOrderByRoleNameAsc("active").stream()
            .map(this::mapToRoleResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(Integer roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        return mapToRoleResponse(role);
    }

    @Override
    @Transactional
    public Integer createRole(RoleRequest request) {
        validateRoleRequest(request, null);
        
        Role role = new Role();
        mapRequestToRole(request, role);
        
        Role savedRole = roleRepository.save(role);
        return savedRole.getRoleId();
    }

    @Override
    @Transactional
    public void updateRole(Integer roleId, RoleRequest request) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        
        validateRoleRequest(request, roleId);
        mapRequestToRole(request, role);
        
        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void deleteRole(Integer roleId, boolean force) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        
        // Kiểm tra xem vai trò có đang được sử dụng không
        if (!force && !role.getEmployeeRoles().isEmpty()) {
            throw new InvalidRequestException(
                "Không thể xóa vai trò đang được sử dụng. Có " + 
                role.getEmployeeRoles().size() + 
                " nhân viên đang sử dụng vai trò này. Sử dụng force=true để bắt buộc xóa."
            );
        }
        
        roleRepository.delete(role);
    }
    
    @Override
    @Transactional
    public void addPermissionsToRole(Integer roleId, List<Integer> permissionIds) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        for (Integer pid : permissionIds) {
            Permission perm = permissionRepository.findById(pid)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền với ID: " + pid));
            if (rolePermissionRepository.findByRoleAndPermission(role, perm).isEmpty()) {
                RolePermission rp = new RolePermission();
                rp.setRole(role);
                rp.setPermission(perm);
                rolePermissionRepository.save(rp);
            }
        }
    }
    
    @Override
    @Transactional
    public void removePermissionsFromRole(Integer roleId, List<Integer> permissionIds) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        for (Integer pid : permissionIds) {
            Permission perm = permissionRepository.findById(pid)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền với ID: " + pid));
            rolePermissionRepository.findByRoleAndPermission(role, perm)
                .ifPresent(rolePermissionRepository::delete);
        }
    }
    
    @Override
    @Transactional
    public void setDefaultRole(Integer roleId) {
        // unset existing default
        roleRepository.findByIsDefaultTrue().ifPresent(r -> {
            r.setIsDefault(false);
            roleRepository.save(r);
        });
        // set new default
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        role.setIsDefault(true);
        roleRepository.save(role);
    }
    
    private void validateRoleRequest(RoleRequest request, Integer roleId) {
        if (!StringUtils.hasText(request.getRoleName())) {
            throw new InvalidRequestException("Tên vai trò không được để trống");
        }
        
        // Kiểm tra tên vai trò đã tồn tại chưa (khi tạo mới hoặc đổi tên)
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            // Nếu là cập nhật, kiểm tra xem tên mới có trùng với vai trò khác không
            if (roleId != null) {
                Role existingRole = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
                
                // Nếu tên mới khác tên cũ và đã tồn tại
                if (!existingRole.getRoleName().equals(request.getRoleName())) {
                    throw new DuplicateResourceException("Tên vai trò đã tồn tại");
                }
            } else {
                // Nếu là tạo mới
                throw new DuplicateResourceException("Tên vai trò đã tồn tại");
            }
        }
        
        // Kiểm tra trạng thái hợp lệ
        if (!StringUtils.hasText(request.getStatus()) || 
            (!request.getStatus().equals("active") && !request.getStatus().equals("inactive"))) {
            throw new InvalidRequestException("Trạng thái không hợp lệ. Các giá trị hợp lệ: active, inactive");
        }
    }
    
    private void mapRequestToRole(RoleRequest request, Role role) {
        role.setRoleName(request.getRoleName());
        role.setRoleDescription(request.getRoleDescription());
        role.setStatus(request.getStatus());
        
        // Nếu isDefault được cung cấp, cập nhật giá trị
        if (request.getIsDefault() != null) {
            role.setIsDefault(request.getIsDefault());
        } else if (role.getIsDefault() == null) {
            // Nếu là tạo mới và isDefault không được cung cấp, mặc định là false
            role.setIsDefault(false);
        }
    }
    
    private RoleResponse mapToRoleResponse(Role role) {
        return new RoleResponse(
            role.getRoleId(),
            role.getRoleName(),
            role.getRoleDescription(),
            role.getIsDefault(),
            role.getStatus()
        );
    }
}
