package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerCreateRequest {
    @Size(max = 50)
    private String username;

    @Size(min = 6, max = 255)
    private String password;

    @NotBlank
    private String name;

    @Pattern(regexp = "^[0-9 ()+-]+$", message = "Invalid phone number format")
    private String phoneNumber;

    @Email
    private String email;

    private String street;
    private String ward;
    private String district;
    private String city;
    private String shippingNote;
    private String note;

    @Min(0)
    private Integer rating = 10;

    @Pattern(regexp = "active|inactive|banned")
    private String status = "active";

    @Min(0)
    private Integer loyaltyPoints = 0;
} 