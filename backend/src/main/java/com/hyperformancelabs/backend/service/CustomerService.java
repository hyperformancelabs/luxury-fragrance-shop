package com.hyperformancelabs.backend.service;


import com.hyperformancelabs.backend.dto.request.LoginRequest;
import com.hyperformancelabs.backend.dto.request.RegisterRequest;
import com.hyperformancelabs.backend.model.Customer;

import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer getCustomerById(Integer id);

    Customer register(RegisterRequest request);

    Customer login(LoginRequest request);

    String loginAndGenerateToken(LoginRequest request);

    Customer getCustomerByUsername(String username);
}
