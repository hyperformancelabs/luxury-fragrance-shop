package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.OrderDTO;

public interface OrderService {
    // Tìm đơn hàng theo ID
    OrderDTO findOrderById(Integer orderId);
}
