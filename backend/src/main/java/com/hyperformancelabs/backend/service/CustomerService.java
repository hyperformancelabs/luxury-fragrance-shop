package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CustomerDTO;

import java.time.LocalDate;

public interface CustomerService {

    CustomerDTO getCustomerById(Integer customerId);

    CustomerDTO getCustomerByUsername(String username);

    void updateCustomer(CustomerDTO customerDTO);

    CustomerDTO getCustomerByEmailOrPhone(String email, String phone);

    // --------------------------------------- ADMIN -----------------------------------------------------

    // Số khách hàng mới hôm nay
    Long countNewCustomersToday();

    // Số khách hàng mới trong tháng hiện tại
    Long countNewCustomersThisMonth();

    // Số khách hàng mới trong năm hiện tại
    Long countNewCustomersThisYear();

    // Số khách hàng mới theo tháng và năm
    Long countNewCustomersByMonthAndYear(int month, int year);

    // Số khách hàng mới theo ngày tháng năm
    Long countNewCustomersBetweenDates(LocalDate startDate, LocalDate endDate);

    // Cập nhật thông tin khách hàng
    void updateCustomerInfo(String customerId, String name, String email, String phoneNumber);
}
