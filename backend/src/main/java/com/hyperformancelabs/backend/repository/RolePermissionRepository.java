package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hyperformancelabs.backend.model.Role;
import com.hyperformancelabs.backend.model.Permission;
import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Integer> {
    List<RolePermission> findAllByRole(Role role);
    Optional<RolePermission> findByRoleAndPermission(Role role, Permission permission);
}
