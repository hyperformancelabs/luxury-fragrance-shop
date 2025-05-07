package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CreateAnonymousOrderRequest;
import com.hyperformancelabs.backend.dto.CreateOrderFromCartRequest;
import com.hyperformancelabs.backend.dto.OrderDetailFullResponse;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.model.Payment;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.repository.PaymentRepository;
import com.hyperformancelabs.backend.service.impl.OrderServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceImpl orderService;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Object>> createOrder(
            @RequestBody CreateOrderFromCartRequest request,
            HttpServletRequest httpServletRequest) {

        Object result = orderService.createOrderFromCart(request, httpServletRequest);

        if (result instanceof Map<?, ?> mapResult &&
                mapResult.containsKey("url") && mapResult.containsKey("orderId")) {

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Redirect to payment",
                    mapResult
            ));
        }


        if (result instanceof Order order) {
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("orderId", order.getOrderId());

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Order placed successfully",
                    responseData
            ));
        }

        return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Order placed successfully",
                result
        ));
    }
    @PostMapping("/create-anonymous")
    public ResponseEntity<ApiResponse<Object>> createOrderAnonymous(
            @RequestBody @Valid CreateAnonymousOrderRequest request,
            HttpServletRequest httpRequest
    ) {
        Object result = orderService.createOrderFromAnonymous(request, httpRequest);

        if (result instanceof Map<?, ?> mapResult &&
                mapResult.containsKey("url") && mapResult.containsKey("orderId")) {

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Redirect to payment",
                    mapResult
            ));
        }

        if (result instanceof Order order) {
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("orderId", order.getOrderId());

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Order placed successfully",
                    responseData
            ));
        }

        return ResponseEntity.ok(new ApiResponse<>(
                ApiResponseStatus.SUCCESS_CODE,
                ApiResponseStatus.SUCCESS_STATUS,
                "Order placed successfully",
                result
        ));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDetailFullResponse>> getFullOrderDetail(@PathVariable("id") Integer orderId) {
        try {
            OrderDetailFullResponse detail = orderService.getFullOrderDetail(orderId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            "Chi tiết đơn hàng đầy đủ",
                            detail
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE).body(
                    new ApiResponse<>(
                            ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }


    @GetMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderStatus(@PathVariable Integer orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            Map<String, Object> status = new HashMap<>();
            status.put("orderId", order.getOrderId());
            status.put("orderStatus", order.getOrderStatus());

            // Lấy payment đầu tiên (nếu có)
            List<Payment> payments = paymentRepository.findByOrder(order);
            if (!payments.isEmpty()) {
                status.put("paymentStatus", payments.get(0).getPaymentStatus());
            } else {
                status.put("paymentStatus", "pending");
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Order status fetched",
                    status
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(ApiResponseStatus.NOT_FOUND_CODE).body(
                    new ApiResponse<>(
                            ApiResponseStatus.NOT_FOUND_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<OrderDetailFullResponse>>> getAllOrdersOfCustomer(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(ApiResponseStatus.UNAUTHORIZED_CODE).body(
                        new ApiResponse<>(
                                ApiResponseStatus.UNAUTHORIZED_CODE,
                                ApiResponseStatus.ERROR_STATUS,
                                ApiResponseStatus.UNAUTHORIZED_MESSAGE,
                                null
                        )
                );
            }

            String token = authHeader.substring(7); // Bỏ "Bearer " ra
            List<OrderDetailFullResponse> orders = orderService.getAllOrdersOfCustomer(token);
            
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS,
                            "Lấy danh sách đơn hàng thành công",
                            orders
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE).body(
                    new ApiResponse<>(
                            ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

}
