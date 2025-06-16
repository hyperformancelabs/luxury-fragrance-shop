package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.CustomerPaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPaymentMethodDTO {
    private Integer id;
    private Integer paymentMethodId;
    private String paymentMethodName;
    private String provider;
    private String accountNumber;
    private Boolean isDefault;

    public static CustomerPaymentMethodDTO fromEntity(CustomerPaymentMethod cpm) {
        return new CustomerPaymentMethodDTO(
                cpm.getCustomerPaymentMethodId(),
                cpm.getPaymentMethod().getPaymentMethodId(),
                cpm.getPaymentMethod().getMethodName(),
                cpm.getProvider(),
                cpm.getAccountNumber(),
                cpm.getIsDefault()
        );
    }
} 