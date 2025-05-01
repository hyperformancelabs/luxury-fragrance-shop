package com.hyperformancelabs.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfile {
    private Integer id;
    private String username;
    private String name;
    private String phoneNumber;
    private String email;
    private String street;
    private String ward;
    private String district;
    private String city;
    private String shippingNote;
    private String note;
    private Integer rating;
    private String status;
    private Integer loyaltyPoints;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
