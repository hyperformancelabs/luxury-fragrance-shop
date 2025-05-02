package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CustomerResponseDTO;
import com.hyperformancelabs.backend.dto.GetAllCustomer;
import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.model.Customer;

import java.util.List;

public interface CustomerService {
    //
//    List<GetAllCustomer> getAllCustomers();
     CustomerResponseDTO register(RegisterRequest request);
//    Customer register(RegisterRequest request);

    Customer login(LoginRequest request);

    String loginAndGenerateToken(LoginRequest request);

    Customer getCustomerByUsername(String username);

    void changePassword(String username, String oldPassword, String newPassword);
    
    // Phương thức mới để lấy số lượng khách hàng mới trong khoảng thời gian
    Integer getNewCustomersCountByDateRange(String startDate, String endDate);
    
    /**
     * Lấy số lượng khách hàng mới trong kỳ trước với cùng độ dài thời gian
     * @param startDate Ngày bắt đầu của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @param endDate Ngày kết thúc của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @return Số lượng khách hàng mới trong kỳ trước
     */
    Integer getNewCustomersCountInPreviousPeriod(String startDate, String endDate);
    
    /**
     * Lấy số lượng khách hàng mới và phần trăm thay đổi so với kỳ trước
     * @param startDate Ngày bắt đầu của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @param endDate Ngày kết thúc của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @return Map chứa số lượng khách hàng mới và phần trăm thay đổi
     */
    java.util.Map<String, Object> getNewCustomersCountWithPercentChange(String startDate, String endDate);
}
