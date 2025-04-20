package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing the many-to-many relationship between employees and roles.
 * Tracks role assignments for employees in the system.
 */
@Entity
@Table(name = "EmployeeRole", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_EmployeeRole", columnNames = {"employee_id", "role_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRole {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_role_id")
    private Integer employeeRoleId;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    
    @Column(name = "status", length = 20, nullable = false)
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(active|inactive)$", message = "Status must be active or inactive")
    private String status = "active";
}