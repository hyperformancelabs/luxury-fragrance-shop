package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing payment methods available in the system.
 * Defines different ways customers can pay for orders.
 */
@Entity
@Table(name = "PaymentMethod")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethod {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_method_id")
    private Integer paymentMethodId;
    
    @Column(name = "method_name", length = 50, nullable = false, unique = true)
    @NotBlank(message = "Method name is required")
    private String methodName;
    
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "logo_url", length = 255)
    private String logoUrl;
    
    @Column(name = "display_order")
    private Integer displayOrder;
    
    @OneToMany(mappedBy = "paymentMethod")
    private Set<CustomerPaymentMethod> customerPaymentMethods = new HashSet<>();
}