package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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
    private String status = "active";
} 