package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface OrderService {
    Object createOrderFromCart(CreateOrderFromCartRequest request, HttpServletRequest servletRequest);
    Object createOrderFromAnonymous(CreateAnonymousOrderRequest request, HttpServletRequest servletRequest);
    OrderDetailFullResponse getFullOrderDetail(Integer orderId);
    List<OrderDetailFullResponse> getAllOrdersOfCustomer(String token);
}
