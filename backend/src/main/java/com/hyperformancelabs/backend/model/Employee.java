package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing an employee in the system.
 * Contains all personal and professional details of staff members.
 */
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
    @NotBlank(message = "Username is required")
    private String username;
    
    @Column(name = "password", length = 255, nullable = false)
    @NotBlank(message = "Password is required")
    private String password;
    
    @Column(name = "full_name", length = 100, nullable = false)
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @Column(name = "phone_number", length = 20, nullable = false)
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9 ()+-]+$", message = "Invalid phone number format")
    private String phoneNumber;
    
    @Column(name = "email", length = 100, unique = true)
    @Email(message = "Invalid email format")
    private String email;
    
    @Column(name = "address", length = 255, nullable = false)
    @NotBlank(message = "Address is required")
    private String address;
    
    @Column(name = "status", length = 20, nullable = false)
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(active|inactive|on_leave)$", message = "Status must be active, inactive, or on_leave")
    private String status = "active";
    
    @Column(name = "start_date", nullable = false)
    @PastOrPresent(message = "Start date must be in the past or present")
    private LocalDate startDate = LocalDate.now();
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "date_of_birth")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    @Column(name = "profile_picture_url", length = 255)
    private String profilePictureUrl;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private Set<EmployeeRole> employeeRoles = new HashSet<>();
    
    @OneToMany(mappedBy = "performedBy")
    private Set<MaterialTransaction> materialTransactions = new HashSet<>();
    
    @OneToMany(mappedBy = "performedBy")
    private Set<InventoryTransaction> inventoryTransactions = new HashSet<>();
    
    @OneToMany(mappedBy = "employee")
    private Set<Order> orders = new HashSet<>();
}