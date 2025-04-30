package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemSummaryDTO {
    private Integer orderItemId;
    private Integer orderId;
    private Integer productVariantId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String note;

    public static OrderItemSummaryDTO toDTO(com.hyperformancelabs.backend.model.OrderItem orderItem) {
        return new OrderItemSummaryDTO(
                orderItem.getOrderItemId(),
                orderItem.getOrder() != null ? orderItem.getOrder().getOrderId() : null,
                orderItem.getProductVariant() != null ? orderItem.getProductVariant().getProductVariantId() : null,
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getNote()
        );
    }
}
