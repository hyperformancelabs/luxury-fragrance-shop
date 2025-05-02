package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CreateOrderRequest;
import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.dto.OrderDetailDTO;
import com.hyperformancelabs.backend.dto.OrderSummary;
import com.hyperformancelabs.backend.model.Order;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
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
    
    // Phương thức mới để lấy dữ liệu doanh thu chi tiết theo khoảng thời gian
    Map<String, Object> getRevenueDataByDateRange(String startDate, String endDate);
    
    // Phương thức mới để lấy số lượng đơn hàng mới trong khoảng thời gian
    /**
     * Get the count of new delivered orders within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @return Count of delivered orders in the date range
     */
    Integer getNewOrdersCountByDateRange(String startDate, String endDate);
    
    /**
     * Lấy số lượng đơn hàng mới trong kỳ trước với cùng độ dài thời gian
     * @param startDate Ngày bắt đầu của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @param endDate Ngày kết thúc của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @return Số lượng đơn hàng mới trong kỳ trước
     */
    Integer getNewOrdersCountInPreviousPeriod(String startDate, String endDate);
    
    /**
     * Lấy số lượng đơn hàng mới và phần trăm thay đổi so với kỳ trước
     * @param startDate Ngày bắt đầu của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @param endDate Ngày kết thúc của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @return Map chứa số lượng đơn hàng mới và phần trăm thay đổi
     */
    Map<String, Object> getNewOrdersCountWithPercentChange(String startDate, String endDate);
    
    // Phương thức mới để lấy giá trị trung bình đơn hàng trong khoảng thời gian
    /**
     * Get the average value of delivered orders within a date range
     * @param startDate Start date in format dd/MM/yyyy
     * @param endDate End date in format dd/MM/yyyy
     * @return Average value of delivered orders in the date range
     */
    BigDecimal getAverageOrderValueByDateRange(String startDate, String endDate);
}
