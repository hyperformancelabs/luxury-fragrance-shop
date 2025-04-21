package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50, message = "Username must be between 3-50 characters")
    @Column(name = "username", nullable = false, length = 50, unique = true)
    private String username;

    @NotBlank(message = "Password cannot be empty")
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @NotBlank(message = "Full name cannot be empty")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^[0-9 ()+-]+$", message = "Invalid phone number format")
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Email(message = "Invalid email format")
    @Column(name = "email", length = 100, unique = true)
    private String email;

    @NotBlank(message = "Address cannot be empty")
    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @NotBlank(message = "Status cannot be empty")
    @Pattern(regexp = "active|inactive|on_leave", message = "Status must be 'active', 'inactive' or 'on_leave'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @NotNull(message = "Start date cannot be empty")
    @PastOrPresent(message = "Start date cannot be in the future")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Past(message = "Date of birth must be in the past")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "profile_picture_url", length = 255)
    private String profilePictureUrl;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EmployeeRole> employeeRoles = new HashSet<>();

    @OneToMany(mappedBy = "performedBy")
    private Set<MaterialTransaction> materialTransactions = new HashSet<>();

    @OneToMany(mappedBy = "performedBy")
    private Set<InventoryTransaction> inventoryTransactions = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    private Set<Order> orders = new HashSet<>();
}
