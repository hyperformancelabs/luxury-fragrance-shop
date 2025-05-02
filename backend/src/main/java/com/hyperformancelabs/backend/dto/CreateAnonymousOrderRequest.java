package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Email;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAnonymousOrderRequest {
    private String name;
    private String email;
    private String phoneNumber;

    private String street;
    private String ward;
    private String district;
    private String city;
    private String shippingNote;

    private String shippingOption;
    private BigDecimal shippingFee;
    private Integer paymentMethodId;

    private List<OrderItemRequest> orderItems;
}




