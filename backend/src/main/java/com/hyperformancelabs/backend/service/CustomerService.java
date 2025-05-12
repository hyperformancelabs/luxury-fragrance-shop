package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CustomerDTO;

public interface CustomerService {

    CustomerDTO getCustomerById(Integer customerId);

    CustomerDTO getCustomerByUsername(String username);

    void updateCustomer(CustomerDTO customerDTO);

    CustomerDTO getCustomerByEmailOrPhone(String email, String phone);
}
