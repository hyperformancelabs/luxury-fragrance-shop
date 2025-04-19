package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing system permissions.
 * Defines the granular permissions that can be assigned to roles.
 */
@Entity
@Table(name = "Permission")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Integer permissionId;
    
    @Column(name = "permission_name", length = 50, nullable = false, unique = true)
    @NotBlank(message = "Permission name is required")
    private String permissionName;
    
    @Column(name = "permission_description", columnDefinition = "NVARCHAR(MAX)")
    private String permissionDescription;
    
    @OneToMany(mappedBy = "permission")
    private Set<RolePermission> rolePermissions = new HashSet<>();
}