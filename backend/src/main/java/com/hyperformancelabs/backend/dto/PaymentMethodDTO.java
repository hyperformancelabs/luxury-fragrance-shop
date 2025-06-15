package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodDTO {
    private Integer id;
    private String name;
    private String description;

    public static PaymentMethodDTO fromEntity(com.hyperformancelabs.backend.model.PaymentMethod pm) {
        return new PaymentMethodDTO(pm.getPaymentMethodId(), pm.getMethodName(), pm.getDescription());
    }
} 