package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer roleId;
    
    @Column(name = "role_name", length = 50, nullable = false, unique = true)
    private String roleName;
    
    @Column(name = "role_description", columnDefinition = "NVARCHAR(MAX)")
    private String roleDescription;
    
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
    
    @Column(name = "status", length = 20, nullable = false)
    private String status = "active";
    
    @OneToMany(mappedBy = "role")
    private Set<EmployeeRole> employeeRoles = new HashSet<>();
    
    @OneToMany(mappedBy = "role")
    private Set<RolePermission> rolePermissions = new HashSet<>();
} 