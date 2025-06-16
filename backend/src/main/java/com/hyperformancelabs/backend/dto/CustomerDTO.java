package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Integer customerId;
    private String username;
    private String name;
    private String phoneNumber;
    private String email;
    private Integer rating;
    private String status;
    private Integer loyaltyPoints;
    private LocalDateTime createAt;

    public static CustomerDTO toDTO(Customer customer) {
        if (customer == null) {
            return null;
        }
        return new CustomerDTO(
                customer.getCustomerId(),
                customer.getUsername(),
                customer.getName(),
                customer.getPhoneNumber(),
                customer.getEmail(),
                customer.getRating(),
                customer.getStatus(),
                customer.getLoyaltyPoints(),
                customer.getCreateAt()
        );
    }
} 