package com.hyperformancelabs.backend.service.impl;


import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.*;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Comparator;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public void createOrder(String username, CreateOrderRequest request) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDate.now().atStartOfDay());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingOption(request.getShippingOption());
        order.setNote(request.getNote());
        order.setOrderStatus("pending");
        order.setShippingFee(BigDecimal.ZERO);
        order.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProductVariant(item.getProductVariant());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getUnitPrice());

            order.addOrderItem(orderItem);
            total = total.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        order.setTotalAmount(total);
        orderRepository.save(order);

//        cart.setStatus("ordered");
        cartRepository.save(cart);
    }



    @Override
    public List<OrderSummary> getOrdersForCustomer(String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByCustomer(customer);

        return orders.stream()
                .map(o -> new OrderSummary(
                        o.getOrderId(),
                        o.getOrderDate(),
                        o.getTotalAmount(),
                        o.getOrderStatus(),
                        o.getShippingOption()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public OrderDetailDTO getOrderDetail(Integer orderId, String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new RuntimeException("Access denied");
        }

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item ->
                new OrderItemDTO(
                        item.getProductVariant().getProduct().getProductName(),
                        item.getProductVariant().getVolume(),
                        item.getProductVariant().getProduct().getBrand().getBrandName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getOrderItemId(),
                        item.getProductVariant().getProductVariantId()
                )
        ).toList();
        System.out.println("Order items count: " + order.getOrderItems().size());
        order.getOrderItems().forEach(i -> System.out.println("Item: " + i.getProductVariant().getProduct().getProductName()));

        return new OrderDetailDTO(
                order.getOrderId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getShippingAddress(),
                order.getShippingOption(),
                itemDTOs,
                null,
                null,
                java.util.Collections.emptyList()
        );
    }

    @Override
    public Page<OrderDTO> getAllOrders(int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Order> orderPage = orderRepository.findAll(pageable);
        return orderPage.map(OrderDTO::toDTO);
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersToday() {
        return orderRepository.getTotalAmountOfDeliveredOrdersToday();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersInCurrentWeek() {
        return orderRepository.getTotalAmountOfDeliveredOrdersInCurrentWeek();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersInCurrentMonth() {
        return orderRepository.getTotalAmountOfDeliveredOrdersInCurrentMonth();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersInCurrentYear() {
        return orderRepository.getTotalAmountOfDeliveredOrdersInCurrentYear();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersByMonthAndYear(int month, int year) {
        return orderRepository.getTotalAmountOfDeliveredOrdersByMonthAndYear(month, year);
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersByDateRange(String startDate, String endDate) {
        return orderRepository.getTotalAmountOfDeliveredOrdersByDateRange(startDate, endDate);
    }

    @Override
    public Map<String, Object> getRevenueDataByDateRange(String startDate, String endDate) {
        // Lấy dữ liệu doanh thu theo ngày
        List<Object[]> revenueByDate = orderRepository.getRevenueByDateRange(startDate, endDate);
        
        // Chuyển đổi kết quả thành dạng dễ sử dụng
        List<Map<String, Object>> chartData = new ArrayList<>();
        
        for (Object[] row : revenueByDate) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", row[0]);  // Ngày (dd/MM/yyyy)
            dataPoint.put("amount", row[1]); // Tổng doanh thu
            dataPoint.put("orderCount", row[2]); // Số lượng đơn hàng
            
            chartData.add(dataPoint);
        }
        
        // Tạo response
        Map<String, Object> response = new HashMap<>();
        response.put("chartData", chartData);
        
        // Tính toán thêm một số thống kê (nếu cần)
        if (!chartData.isEmpty()) {
            // Tìm ngày có doanh thu cao nhất
            Map<String, Object> maxRevenueDay = chartData.stream()
                .max(Comparator.comparing(day -> ((BigDecimal) day.get("amount"))))
                .orElse(null);
                
            if (maxRevenueDay != null) {
                response.put("maxRevenueDay", maxRevenueDay);
            }
            
            // Tính doanh thu trung bình mỗi ngày
            BigDecimal totalRevenue = chartData.stream()
                .map(day -> (BigDecimal) day.get("amount"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            BigDecimal avgDailyRevenue = totalRevenue.divide(BigDecimal.valueOf(chartData.size()), 0, RoundingMode.HALF_UP);
            response.put("averageDailyRevenue", avgDailyRevenue);
        } else {
            // Nếu không có dữ liệu, cung cấp giá trị mặc định
            response.put("maxRevenueDay", null);
            response.put("averageDailyRevenue", BigDecimal.ZERO);
        }
        
        return response;
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersByQuarterAndYear(int quarter, int year) {
        return orderRepository.getTotalAmountOfDeliveredOrdersByQuarterAndYear(quarter, year);
    }

    @Override
    @Transactional
    public void UpdateOrderStatus(Integer orderId, String status) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Normalize status to lower-case for consistent storage
        String normalizedStatus = status == null ? "" : status.toLowerCase();

        java.util.Set<String> allowedStatuses = java.util.Set.of("pending", "processing", "shipping", "delivered", "cancelled");
        if (!allowedStatuses.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }

        // Use repository query to bypass Bean Validation issues
        orderRepository.updateOrderStatus(orderId, normalizedStatus);
    }
    
    /**
     * Get the count of new delivered orders within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @return Count of delivered orders in the date range
     */
    @Override
    public Integer getNewOrdersCountByDateRange(String startDate, String endDate) {
        return orderRepository.getNewOrdersCountByDateRange(startDate, endDate);
    }
    
    /**
     * Get the count of new delivered orders in previous period
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @return Count of delivered orders in the previous period
     */
    @Override
    public Integer getNewOrdersCountInPreviousPeriod(String startDate, String endDate) {
        return orderRepository.getNewOrdersCountInPreviousPeriod(startDate, endDate);
    }
    
    /**
     * Get the count of new delivered orders with percent change
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @return Map with count and percent change
     */
    @Override
    public Map<String, Object> getNewOrdersCountWithPercentChange(String startDate, String endDate) {
        // Lấy số lượng đơn hàng mới trong kỳ hiện tại
        Integer currentPeriodCount = getNewOrdersCountByDateRange(startDate, endDate);
        
        // Lấy số lượng đơn hàng mới trong kỳ trước
        Integer previousPeriodCount = getNewOrdersCountInPreviousPeriod(startDate, endDate);
        
        // Tính toán phần trăm thay đổi
        double percentChange = 0.0;
        if (previousPeriodCount > 0) {
            percentChange = ((double) (currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100;
        }
        
        // Làm tròn phần trăm thay đổi đến 1 chữ số thập phân
        percentChange = Math.round(percentChange * 10) / 10.0;
        
        // Tạo kết quả trả về
        Map<String, Object> result = new HashMap<>();
        result.put("newOrdersCount", currentPeriodCount);
        result.put("previousPeriodChange", percentChange);
        
        return result;
    }
    
    /**
     * Get the average value of delivered orders within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @return Average value of delivered orders in the date range
     */
    @Override
    public BigDecimal getAverageOrderValueByDateRange(String startDate, String endDate) {
        return orderRepository.getAverageOrderValueByDateRange(startDate, endDate);
    }
    
    /**
     * Get the top K recent orders within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @param limit Number of orders to retrieve (K)
     * @return List of top K recent orders in the date range
     */
    @Override
    public List<OrderDTO> getTopRecentOrdersByDateRange(String startDate, String endDate, int limit) {
        List<Order> orders = orderRepository.findTopRecentOrdersByDateRange(startDate, endDate, limit);
        return orders.stream()
                .map(OrderDTO::toDTO)
                .collect(Collectors.toList());
    }
}

