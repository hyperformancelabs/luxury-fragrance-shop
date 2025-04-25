package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CreateOrderRequest;
import com.hyperformancelabs.backend.dto.OrderDetailDTO;
import com.hyperformancelabs.backend.dto.OrderSummary;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<String>> checkout(@RequestBody @Valid CreateOrderRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        orderService.createOrder(username, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "success", "Đặt hàng thành công", null)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderSummary>>> getMyOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<OrderSummary> orders = orderService.getOrdersForCustomer(username);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "success", "Lấy danh sách đơn hàng thành công", orders)
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDetailDTO>> getOrderDetail(@PathVariable Integer orderId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        OrderDetailDTO orderDetail = orderService.getOrderDetail(orderId, username);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "success", "Lấy chi tiết đơn hàng thành công", orderDetail)
        );
    }


}
