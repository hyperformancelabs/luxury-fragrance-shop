package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing saved payment methods for customers.
 * Stores payment credentials and preferences.
 */
@Entity
@Table(name = "CustomerPaymentMethod", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_CustomerPaymentMethod", columnNames = {"customer_id", "payment_method_id", "account_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPaymentMethod {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_payment_method_id")
    private Integer customerPaymentMethodId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "payment_method_id", nullable = false)
    private PaymentMethod paymentMethod;
    
    @Column(name = "provider", length = 50)
    private String provider;
    
    @Column(name = "account_number", length = 50)
    private String accountNumber;
    
    @Column(name = "account_name", length = 100)
    private String accountName;
    
    @Column(name = "expiry_date", length = 10)
    @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{2}$", message = "Expiry date must be in MM/YY format")
    private String expiryDate;
    
    @Column(name = "token", length = 255)
    private String token;
    
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
    
    @Column(name = "status", length = 20, nullable = false)
    @Pattern(regexp = "^(active|inactive)$", message = "Status must be active or inactive")
    private String status = "active";
}