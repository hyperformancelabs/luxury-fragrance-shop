package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    List<Permission> findAllByOrderByPermissionNameAsc();
}
