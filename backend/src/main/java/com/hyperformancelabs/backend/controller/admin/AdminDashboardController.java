package com.hyperformancelabs.backend.controller.admin;

import com.hyperformancelabs.backend.dto.LowStockProductDTO;
import com.hyperformancelabs.backend.dto.RecentOrderDTO;
import com.hyperformancelabs.backend.dto.TopSellingProductDTO;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.service.InventoryService;
import com.hyperformancelabs.backend.service.OrderService;
import com.hyperformancelabs.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminDashboardController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;
    
    @Autowired
    private InventoryService inventoryService;

    @GetMapping({"", "/", "/dashboard"})
    public String dashboard(Model model,
                            @RequestParam(value = "range", required = false, defaultValue = "today") String range,
                            @RequestParam(value = "start", required = false) String startDateStr,
                            @RequestParam(value = "end", required = false) String endDateStr) {
        // Get today's date
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        // Revenue data
        Map<String, Object> revenueData = new HashMap<>();
        // Total orders data
        Map<String, Object> totalOrdersData = new HashMap<>();
        // New customer data
        Map<String, Object> newCustomerData = new HashMap<>();

        if (range.equals("custom") && startDateStr != null && endDateStr != null) {
            LocalDate start = LocalDate.parse(startDateStr);
            LocalDate end = LocalDate.parse(endDateStr);

            revenueData.put("custom", orderService.getTotalRevenueBetweenDates(start, end));
            totalOrdersData.put("custom", orderService.countOrdersBetweenDates(start, end));
            newCustomerData.put("custom", customerService.countNewCustomersBetweenDates(start, end));
            model.addAttribute("startDate", startDateStr);
            model.addAttribute("endDate", endDateStr);

        }
        else {
            // Doanh thu hôm nay
            revenueData.put("today", orderService.getTotalRevenueToday());
            // Doanh thu tháng hiện tại
            revenueData.put("thisMonth", orderService.getTotalRevenueCurrentMonth());
            // Doanh thu năm hiện tại
            revenueData.put("thisYear", orderService.getTotalRevenueCurrentYear());


            // Tổng số đơn hàng hôm nay
            totalOrdersData.put("today", orderService.countOrdersToday());
            // Tổng số đơn hàng tháng hiện tại
            totalOrdersData.put("thisMonth", orderService.countOrdersThisMonth());
            // Tổng số đơn hàng năm hiện tại
            totalOrdersData.put("thisYear", orderService.countOrdersThisYear());

            // Số khách hàng mới hôm nay
            newCustomerData.put("today", customerService.countNewCustomersToday());
            // Số khách hàng mới tháng hiện tại
            newCustomerData.put("thisMonth", customerService.countNewCustomersThisMonth());
            // Số khách hàng mới năm hiện tại
            newCustomerData.put("thisYear", customerService.countNewCustomersThisYear());
        }

        // Sample sales data for chart
//        Map<String, BigDecimal> salesData = new HashMap<>();
//        salesData.put("T1", BigDecimal.valueOf(4500000));
//        salesData.put("T2", BigDecimal.valueOf(5200000));
//        salesData.put("T3", BigDecimal.valueOf(4800000));
//        salesData.put("T4", BigDecimal.valueOf(6100000));
//        salesData.put("T5", BigDecimal.valueOf(7200000));
//        salesData.put("T6", BigDecimal.valueOf(6700000));
        
        // Get top selling products
        // Sales Data
        Map<String, BigDecimal> salesMonthlyData = new HashMap<>();
        salesMonthlyData = orderService.getMonthlyRevenueTillNowOfCurrentYear();
        Map<String, BigDecimal> salesYearlyData = new HashMap<>();
        salesYearlyData = orderService.getRevenueByYearRange(2023, 2025);

        // Get top selling products
        List<TopSellingProductDTO> topProducts = productService.getTopSellingProducts(null, 5);
        
        // Get low stock products
        List<LowStockProductDTO> lowStockProducts = inventoryService.getLowStockProducts(5);

        // Get recent orders
        List<RecentOrderDTO> recentOrders = orderService.findTop3ByOrderByOrderDateDesc();

        model.addAttribute("today", today.format(formatter));
        model.addAttribute("totalOrdersData", totalOrdersData);
        model.addAttribute("newCustomerData", newCustomerData);
        model.addAttribute("revenueData", revenueData);
        model.addAttribute("range", range);
        model.addAttribute("salesMonthlyData", salesMonthlyData);
        model.addAttribute("salesYearlyData", salesYearlyData);
        model.addAttribute("topProducts", topProducts);
        model.addAttribute("lowStockProducts", lowStockProducts);
        model.addAttribute("recentOrders", recentOrders);

//        System.out.println("Range: " + range);
//        System.out.println("Start: " + LocalDate.parse(startDateStr));
//        System.out.println("End: " + LocalDate.parse(endDateStr));
//        System.out.println("total revenue: " + orderService.getTotalRevenueBetweenDates(LocalDate.parse(startDateStr), LocalDate.parse(endDateStr)));
        
        return "admin/dashboard";
    }
}
