package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {

    @NotNull
    private Integer customerId;

    @NotBlank
    private String shippingAddress;

    private String shippingNote;

    @NotNull
    private Integer paymentMethodId;

    @NotNull
    private BigDecimal shippingCost;

    @NotEmpty
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Integer productVariantId;

        @NotNull
        @Positive
        private Integer quantity;

        private String note;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true)
        private BigDecimal unitPrice;
    }
}
