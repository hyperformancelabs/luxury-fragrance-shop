package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOrderFromCartRequest {

//    @NotNull(message = "Customer ID is required")
//    private Integer customerId;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private String shippingNote;

    @NotNull(message = "Shipping cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Shipping cost must be non-negative")
    private BigDecimal shippingCost;

    @NotNull(message = "Payment method ID is required")
    private Integer paymentMethodId;
}
