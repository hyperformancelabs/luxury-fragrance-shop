package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CreateOrderRequest;
import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.dto.OrderDetailDTO;
import com.hyperformancelabs.backend.dto.OrderSummary;
import com.hyperformancelabs.backend.model.Order;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    void createOrder(String username, CreateOrderRequest request);
    List<OrderSummary> getOrdersForCustomer(String username);
    OrderDetailDTO getOrderDetail(Integer orderId, String username);
    Page<OrderDTO> getAllOrders(int page);
    BigDecimal getTotalAmountOfDeliveredOrdersToday();
    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentWeek();
    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentMonth();
    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentYear();
    BigDecimal getTotalAmountOfDeliveredOrdersByMonthAndYear(int month, int year);
    BigDecimal getTotalAmountOfDeliveredOrdersByDateRange(String startDate, String endDate);
    BigDecimal getTotalAmountOfDeliveredOrdersByQuarterAndYear(int quarter, int year);
    void UpdateOrderStatus(Integer orderId, String status);
}
