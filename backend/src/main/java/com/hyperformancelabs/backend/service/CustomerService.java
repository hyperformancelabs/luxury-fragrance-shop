package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.models.Customer;

import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer getCustomerById(Integer id);

    Customer register(RegisterRequest request);

    Customer login(LoginRequest request);
}
