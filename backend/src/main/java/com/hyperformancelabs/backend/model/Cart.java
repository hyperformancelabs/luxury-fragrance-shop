package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a shopping cart.
 * Stores items that customers have selected for potential purchase.
 */
@Entity
@Table(name = "Cart")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    @Column(name = "status", length = 20, nullable = false)
    @Pattern(regexp = "^(active|abandoned|converted)$", 
             message = "Status must be active, abandoned, or converted")
    private String status = "active";
    
    @Column(name = "total_amount", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = true, message = "Total amount must be non-negative")
    private BigDecimal totalAmount;
    
    @Column(name = "session_id", length = 50)
    private String sessionId;
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> cartItems = new HashSet<>();
}