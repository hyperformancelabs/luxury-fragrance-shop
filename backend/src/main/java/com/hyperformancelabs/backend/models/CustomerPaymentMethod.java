package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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
    
    @Column(name = "token", length = 255)
    private String token;
    
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
} 