package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public OrderDTO findOrderById(Integer orderId) {
        Order order = orderRepository.findByOrderId(orderId);
        return order != null ? convertToOrderDTO(order) : null;
    }

    private OrderDTO convertToOrderDTO(Order order) {
        return new OrderDTO(
                order.getOrderId(),
                order.getCustomer().getCustomerId(),
                order.getEmployee() != null ? order.getEmployee().getEmployeeId() : null,
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getShippingFee(),
                order.getOrderStatus(),
                order.getShippingAddress(),
                order.getShippingOption(),
                order.getNote(),
                order.getEstimatedDeliveryDate()
        );
    }
}
