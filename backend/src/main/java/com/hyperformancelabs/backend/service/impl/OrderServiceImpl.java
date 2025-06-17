package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.CreateOrderRequest;
import com.hyperformancelabs.backend.dto.OrderDetailDTO;
import com.hyperformancelabs.backend.dto.OrderItemDTO;
import com.hyperformancelabs.backend.dto.OrderSummary;
import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.CartItem;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.model.InventoryTransaction;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.model.OrderItem;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.repository.InventoryTransactionRepository;
import com.hyperformancelabs.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private InventoryTransactionRepository inventoryTransactionRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

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
        // Add logger
        org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(OrderServiceImpl.class);
        logger.info("UpdateOrderStatus: Updating order status for order ID: {}, new status: {}", orderId, status);
        
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Normalize status to lower-case for consistent storage
        String normalizedStatus = status == null ? "" : status.toLowerCase();

        java.util.Set<String> allowedStatuses = java.util.Set.of("pending", "processing", "shipping", "delivered", "cancelled");
        if (!allowedStatuses.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }

        // If changing to cancelled status, restore inventory
        if ("cancelled".equalsIgnoreCase(normalizedStatus) && 
            !"cancelled".equalsIgnoreCase(order.getOrderStatus())) {
            
            // Fetch order with items to access product variants
            Order orderWithItems = orderRepository.findByIdWithItems(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
                    
            // Restore inventory
            for (var item : orderWithItems.getOrderItems()) {
                var variant = item.getProductVariant();
                variant.setQuantityInStock(variant.getQuantityInStock() + item.getQuantity());
                productVariantRepository.save(variant);
            }
        }
        
        // If changing to delivered status, log inventory transactions
        if ("delivered".equalsIgnoreCase(normalizedStatus) && 
            !"delivered".equalsIgnoreCase(order.getOrderStatus())) {
            
            logger.info("UpdateOrderStatus: Order {} status changing to delivered, creating inventory transactions", orderId);
            
            Order orderWithItems = orderRepository.findByIdWithItems(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            
            logger.info("UpdateOrderStatus: Found order with {} items", orderWithItems.getOrderItems().size());
            
            // Get the employee who is performing this action (from Spring Security context)
            Employee employee;
            try {
                String username = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getName();
                
                logger.info("UpdateOrderStatus: Current user: {}", username);
                
                employee = employeeRepository.findByUsername(username)
                    .orElse(null);
            } catch (Exception e) {
                logger.warn("UpdateOrderStatus: Could not get current user or employee not found", e);
                employee = null;
            }
            
            // If employee not found, use employee with ID 1
            if (employee == null) {
                logger.info("UpdateOrderStatus: Using default employee with ID 1");
                employee = employeeRepository.findById(1)
                    .orElseThrow(() -> new RuntimeException("Default employee not found"));
            }
            
            logger.info("UpdateOrderStatus: Using employee: {}", employee.getEmployeeId());
            
            // Get current database time to avoid constraint violations
            java.time.LocalDateTime dbNow;
            try {
                jakarta.persistence.Query query = entityManager.createNativeQuery("SELECT GETDATE()");
                java.sql.Timestamp currentDBTime = (java.sql.Timestamp) query.getSingleResult();
                dbNow = currentDBTime.toLocalDateTime();
                logger.info("UpdateOrderStatus: Using database time: {}", dbNow);
            } catch (Exception e) {
                logger.warn("UpdateOrderStatus: Could not get database time, using system time minus 1 hour", e);
                dbNow = java.time.LocalDateTime.now().minusHours(1);
            }
            
            // Log inventory transaction for each order item
            for (OrderItem item : orderWithItems.getOrderItems()) {
                ProductVariant variant = item.getProductVariant();
                logger.info("UpdateOrderStatus: Creating inventory transaction for product variant: {}", variant.getProductVariantId());
                
                // Create inventory transaction
                InventoryTransaction transaction = new InventoryTransaction();
                transaction.setProductVariant(variant);
                transaction.setPerformedBy(employee);
                transaction.setTransactionType("sell"); // Use "sell" type for delivered orders
                transaction.setTransactionDate(dbNow);
                
                // IMPORTANT: For log-only transactions, we don't change the actual inventory
                // We're just recording what happened, so beforeQuantity should be the current quantity
                transaction.setBeforeQuantity(variant.getQuantityInStock());
                transaction.setQuantity(item.getQuantity());
                transaction.setAfterQuantity(variant.getQuantityInStock()); // Same as before quantity since we're not changing inventory
                
                transaction.setReason("Đơn hàng #" + orderId + " đã được giao thành công");
                transaction.setNote("Giao dịch được tạo tự động khi đơn hàng chuyển sang trạng thái đã giao");
                transaction.setCostPrice(item.getUnitPrice()); // Use unit price as cost price
                
                // Save the transaction
                InventoryTransaction savedTransaction = inventoryTransactionRepository.save(transaction);
                logger.info("UpdateOrderStatus: Created inventory transaction with ID: {}", savedTransaction.getInventoryTransactionId());
            }
        }

        // Use repository query to bypass Bean Validation issues
        orderRepository.updateOrderStatus(orderId, normalizedStatus);
        logger.info("UpdateOrderStatus: Successfully updated order {} status to {}", orderId, normalizedStatus);
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

