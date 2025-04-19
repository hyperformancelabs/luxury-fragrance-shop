package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;
    
    @Column(name = "username", length = 50, unique = true)
    private String username;
    
    @Column(name = "password", length = 255)
    private String password;
    
    @Column(name = "name", length = 100, nullable = false)
    private String name;
    
    @Column(name = "phone_number", length = 20, unique = true)
    private String phoneNumber;
    
    @Column(name = "email", length = 100, unique = true)
    private String email;
    
    @Column(name = "street", length = 255)
    private String street;
    
    @Column(name = "ward", length = 50)
    private String ward;
    
    @Column(name = "district", length = 50)
    private String district;
    
    @Column(name = "city", length = 50)
    private String city;
    
    @Column(name = "shipping_note", length = 50)
    private String shippingNote;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
    
    @Column(name = "rating", nullable = false)
    private Integer rating = 10;
    
    @Column(name = "status", length = 20, nullable = false)
    private String status = "active";
    
    @Column(name = "loyalty_points", nullable = false)
    private Integer loyaltyPoints = 0;
    
    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt = LocalDateTime.now();
    
    @Column(name = "update_at")
    private LocalDateTime updateAt;
    
    @OneToMany(mappedBy = "customer")
    private Set<Cart> carts = new HashSet<>();
    
    @OneToMany(mappedBy = "customer")
    private Set<CustomerPaymentMethod> paymentMethods = new HashSet<>();
    
    @OneToMany(mappedBy = "customer")
    private Set<Order> orders = new HashSet<>();
} 