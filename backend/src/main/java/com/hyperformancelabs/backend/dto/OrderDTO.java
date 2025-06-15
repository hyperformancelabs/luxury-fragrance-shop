package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Integer orderId;
    private Integer customerId;
    private Integer employeeId;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private String orderStatus;
    private String shippingAddress;
    private String shippingOption;
    private String note;
    private LocalDate estimatedDeliveryDate;
    private String customerName;
    private Integer itemsCount;

//    private List<OrderItemSummaryDTO> orderItems;
//    private List<PaymentDTO> payments;
//    private List<ShipmentDTO> shipments;
//    private List<OrderPromotionDTO> orderPromotions;

    public static OrderDTO toDTO(com.hyperformancelabs.backend.model.Order order) {
        return new OrderDTO(
                order.getOrderId(),
                order.getCustomer() != null ? order.getCustomer().getCustomerId() : null,
                order.getEmployee() != null ? order.getEmployee().getEmployeeId() : null,
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getShippingFee(),
                order.getOrderStatus(),
                order.getShippingAddress(),
                order.getShippingOption(),
                order.getNote(),
                order.getEstimatedDeliveryDate(),
                order.getCustomer() != null ? order.getCustomer().getName() : null,
                order.getOrderItems().size()
//                order.getOrderItems().stream().map(OrderItemSummaryDTO::toDTO).toList(),
//                order.getPayments().stream().map(PaymentDTO::toDTO).toList(),
//                order.getShipments().stream().map(ShipmentDTO::toDTO).toList(),
//                order.getOrderPromotions().stream().map(OrderPromotionDTO::toDTO).toList()
        );
    }
}
