package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer employeeId;
    
    @Column(name = "username", length = 50, nullable = false, unique = true)
    private String username;
    
    @Column(name = "password", length = 255, nullable = false)
    private String password;
    
    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;
    
    @Column(name = "phone_number", length = 20, nullable = false)
    private String phoneNumber;
    
    @Column(name = "email", length = 100, unique = true)
    private String email;
    
    @Column(name = "address", length = 255, nullable = false)
    private String address;
    
    @Column(name = "status", length = 20, nullable = false)
    private String status = "active";
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate = LocalDate.now();
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "profile_picture_url", length = 255)
    private String profilePictureUrl;
    
    @OneToMany(mappedBy = "employee")
    private Set<EmployeeRole> employeeRoles = new HashSet<>();
    
    @OneToMany(mappedBy = "performedBy")
    private Set<MaterialTransaction> materialTransactions = new HashSet<>();
    
    @OneToMany(mappedBy = "performedBy")
    private Set<InventoryTransaction> inventoryTransactions = new HashSet<>();
    
    @OneToMany(mappedBy = "employee")
    private Set<Order> orders = new HashSet<>();
} 