package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.models.Customer;

import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer getCustomerById(Integer id);
}
