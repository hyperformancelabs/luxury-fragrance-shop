package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.OrderListResponse;
import org.springframework.data.domain.Sort;

import java.util.Map;

public interface OrderManagementService {
    /**
     * Get all orders with pagination, sorting, and dynamic filtering
     * @param page         page number (0-based)
     * @param size         page size
     * @param sortBy       property to sort
     * @param sortDirection sort direction
     * @param filters      map of filter criteria
     * @return paginated list response
     */
    OrderListResponse getAllOrders(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters);

    /**
     * Get detailed information of an order (admin)
     */
    com.hyperformancelabs.backend.dto.OrderDetailDTO getOrderDetail(Integer orderId);

    /**
     * Create order manually at POS/CSKH
     */
    Integer createOrder(com.hyperformancelabs.backend.dto.AdminCreateOrderRequest request, String employeeUsername);

    /**
     * Update general order info (address, note, shipping fee, option)
     */
    void updateOrderGeneralInfo(Integer orderId, com.hyperformancelabs.backend.dto.UpdateOrderRequest request);

    void updateOrderStatus(Integer orderId, String status);

    void cancelOrder(Integer orderId, String reason);

    java.util.List<com.hyperformancelabs.backend.dto.PaymentMethodDTO> getPaymentMethods();

    java.util.List<String> getShippingProviders();

    // Item operations
    Integer addOrderItem(Integer orderId, com.hyperformancelabs.backend.dto.OrderItemRequest request);
    void updateOrderItemQuantity(Integer orderId, Integer orderItemId, Integer quantity);
    void deleteOrderItem(Integer orderId, Integer orderItemId);

    // Shipment & Payment
    void updateShipment(Integer orderId, com.hyperformancelabs.backend.dto.UpdateShipmentRequest request);
    void updatePayment(Integer orderId, com.hyperformancelabs.backend.dto.UpdatePaymentRequest request);

    // Promotions
    void applyPromotion(Integer orderId, Integer promotionId);
    void removePromotion(Integer orderId, Integer promotionId);
} 