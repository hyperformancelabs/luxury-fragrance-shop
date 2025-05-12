package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    // Tìm đơn hàng theo ID
    OrderDTO findOrderById(Integer orderId);

    // Tìm đơn hàng theo ID của khách hàng
    List<OrderDTO> findOrdersByCustomerId(Integer customerId);

    // Lấy danh sách đơn hàng theo số điện thoại
    List<OrderDTO> findByPhone(String phone);
}
