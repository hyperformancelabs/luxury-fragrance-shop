package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.PermissionResponse;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Permission;
import com.hyperformancelabs.backend.model.Role;
import com.hyperformancelabs.backend.repository.PermissionRepository;
import com.hyperformancelabs.backend.repository.RolePermissionRepository;
import com.hyperformancelabs.backend.repository.RoleRepository;
import com.hyperformancelabs.backend.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPermissions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("permissionName").ascending());
        Page<Permission> pagePerm = permissionRepository.findAll(pageable);
        List<PermissionResponse> list = pagePerm.getContent().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
        Map<String, Object> resp = new HashMap<>();
        resp.put("permissions", list);
        resp.put("currentPage", pagePerm.getNumber());
        resp.put("totalItems", pagePerm.getTotalElements());
        resp.put("totalPages", pagePerm.getTotalPages());
        return resp;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAllByOrderByPermissionNameAsc().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionResponse getPermissionById(Integer permissionId) {
        Permission perm = permissionRepository.findById(permissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền với ID: " + permissionId));
        return mapToDto(perm);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getPermissionsByRole(Integer roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        return rolePermissionRepository.findAllByRole(role).stream()
            .map(rp -> mapToDto(rp.getPermission()))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAvailablePermissionsByRole(Integer roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        List<Permission> all = permissionRepository.findAllByOrderByPermissionNameAsc();
        List<Permission> assigned = rolePermissionRepository.findAllByRole(role).stream()
            .map(rp -> rp.getPermission())
            .collect(Collectors.toList());
        return all.stream()
            .filter(p -> !assigned.contains(p))
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    private PermissionResponse mapToDto(Permission p) {
        return new PermissionResponse(
            p.getPermissionId(), p.getPermissionName(), p.getPermissionDescription()
        );
    }
}
