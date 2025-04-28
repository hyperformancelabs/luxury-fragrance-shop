package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CreateOrderRequest;
import com.hyperformancelabs.backend.dto.OrderDetailDTO;
import com.hyperformancelabs.backend.dto.OrderSummary;

import java.math.BigDecimal;
import java.util.List;

public interface OrderService {
    void createOrder(String username, CreateOrderRequest request);
    List<OrderSummary> getOrdersForCustomer(String username);
    OrderDetailDTO getOrderDetail(Integer orderId, String username);
    BigDecimal getTotalAmountOfDeliveredOrdersToday();
    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentWeek();
    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentMonth();
    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentYear();
    BigDecimal getTotalAmountOfDeliveredOrdersByMonthAndYear(int month, int year);
    BigDecimal getTotalAmountOfDeliveredOrdersByDateRange(String startDate, String endDate);
    BigDecimal getTotalAmountOfDeliveredOrdersByQuarterAndYear(int quarter, int year);
}
