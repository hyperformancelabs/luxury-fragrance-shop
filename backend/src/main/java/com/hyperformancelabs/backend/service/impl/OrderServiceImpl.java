package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public OrderDTO findOrderById(Integer orderId) {
        Order order = orderRepository.findByOrderId(orderId);
        return order != null ? convertToOrderDTO(order) : null;
    }

    @Override
    public List<OrderDTO> findOrdersByCustomerId(Integer customerId) {
        return orderRepository.findOrdersByCustomer_CustomerId(customerId)
                .stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> findByPhone(String phone) {
        return orderRepository.findByCustomer_PhoneNumber(phone)
                .stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
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
