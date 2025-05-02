package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CreateOrderRequest;
import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.dto.OrderDetailDTO;
import com.hyperformancelabs.backend.dto.OrderSummary;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<String>> checkout(@RequestBody @Valid CreateOrderRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            orderService.createOrder(username, request);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.CREATE_SUCCESS_MESSAGE, null)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderSummary>>> getMyOrders() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<OrderSummary> orders = orderService.getOrdersForCustomer(username);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, orders)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDetailDTO>> getOrderDetail(@PathVariable Integer orderId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            OrderDetailDTO orderDetail = orderService.getOrderDetail(orderId, username);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, orderDetail)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/total-amount-of-delivered-orders-today")
    public ResponseEntity<ApiResponse<String>> getTotalAmountOfDeliveredOrdersToday() {
        try {
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersToday();
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, totalAmount.toString())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/total-amount-of-delivered-orders-week")
    public ResponseEntity<ApiResponse<String>> getTotalAmountOfDeliveredOrdersWeek() {
        try {
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersInCurrentWeek();
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, totalAmount.toString())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/total-amount-of-delivered-orders-month")
    public ResponseEntity<ApiResponse<String>> getTotalAmountOfDeliveredOrdersMonth() {
        try {
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersInCurrentMonth();
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, totalAmount.toString())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/total-amount-of-delivered-orders-year")
    public ResponseEntity<ApiResponse<String>> getTotalAmountOfDeliveredOrdersYear() {
        try {
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersInCurrentYear();
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, totalAmount.toString())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/total-amount-of-delivered-orders-by-month-and-year")
    public ResponseEntity<ApiResponse<String>> getTotalAmountOfDeliveredOrdersByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year
    ) {
        try {
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersByMonthAndYear(month, year);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, totalAmount.toString())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/total-amount-of-delivered-orders-by-date-range")
    public ResponseEntity<ApiResponse<String>> getTotalAmountOfDeliveredOrdersByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        try {
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersByDateRange(startDate, endDate);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, totalAmount.toString())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/revenue-by-date-range")
    public ResponseEntity<ApiResponse<Object>> getRevenueDataByDateRange(
            @RequestParam String startDate,  // format: dd/MM/yyyy
            @RequestParam String endDate     // format: dd/MM/yyyy
    ) {
        try {
            // Lấy tổng doanh thu
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersByDateRange(startDate, endDate);
            
            // Lấy doanh thu theo ngày trong khoảng thời gian (cho biểu đồ)
            Map<String, Object> revenueData = orderService.getRevenueDataByDateRange(startDate, endDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalAmount", totalAmount);
            // Trả về dữ liệu đã được xử lý thành đúng định dạng
            response.putAll(revenueData);
            
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, response)
            );
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, 
                    "Error: " + e.getMessage(), null)
            );
        }
    }
    
    @GetMapping("/new-orders-count-by-date-range")
    public ResponseEntity<ApiResponse<Object>> getNewOrdersCountByDateRange(
            @RequestParam String startDate,  // format: dd/MM/yyyy
            @RequestParam String endDate     // format: dd/MM/yyyy
    ) {
        try {
            // Lấy số lượng đơn hàng mới trong khoảng thời gian
            Integer newOrdersCount = orderService.getNewOrdersCountByDateRange(startDate, endDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("newOrdersCount", newOrdersCount);
            
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, 
                    ApiResponseStatus.GET_SUCCESS_MESSAGE, response)
            );
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, 
                    "Error: " + e.getMessage(), null)
            );
        }
    }

    @GetMapping("/total-amount-of-delivered-orders-by-quarter-and-year")
    public ResponseEntity<ApiResponse<String>> getTotalAmountOfDeliveredOrdersByQuarterAndYear(
            @RequestParam int quarter,
            @RequestParam int year
    ) {
        try {
            BigDecimal totalAmount = orderService.getTotalAmountOfDeliveredOrdersByQuarterAndYear(quarter, year);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, totalAmount.toString())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null)
            );
        }
    }

    @PutMapping("/update-status")
    public ResponseEntity<ApiResponse<String>> updateOrderStatus(
            @RequestParam Integer orderId,
            @RequestParam String status
    ) {
        try {
            orderService.UpdateOrderStatus(orderId, status);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.UPDATE_SUCCESS_MESSAGE, null)
            );
        } catch (Exception e) {
            // Convert stack trace to string
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String stackTrace = sw.toString();

            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                        ApiResponseStatus.BAD_REQUEST_CODE, 
                        ApiResponseStatus.ERROR_STATUS, 
                        "Error: " + e.getMessage() + "\nStack trace: " + stackTrace,
                        null
                    )
            );
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getAllOrders(@RequestParam(defaultValue = "0") int page) {
        try {
            Page<OrderDTO> orders = orderService.getAllOrders(page);
            return ResponseEntity.ok(
                    new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, orders)
            );
        } catch (Exception e) {
            // Convert stack trace to string
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String stackTrace = sw.toString();

            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                        ApiResponseStatus.BAD_REQUEST_CODE, 
                        ApiResponseStatus.ERROR_STATUS, 
                        "Error: " + e.getMessage() + "\nStack trace: " + stackTrace,
                        null
                    )
            );
        }
    }
}

