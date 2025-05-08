package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    List<Role> findAllByStatusOrderByRoleNameAsc(String status);
    
    List<Role> findAllByOrderByRoleNameAsc();
    
    boolean existsByRoleName(String roleName);
    
    Optional<Role> findByIsDefaultTrue();
}
