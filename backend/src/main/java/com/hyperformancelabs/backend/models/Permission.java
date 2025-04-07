package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

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
    private String permissionName;
    
    @Column(name = "permission_description", columnDefinition = "NVARCHAR(MAX)")
    private String permissionDescription;
    
    @OneToMany(mappedBy = "permission")
    private Set<RolePermission> rolePermissions = new HashSet<>();
} 