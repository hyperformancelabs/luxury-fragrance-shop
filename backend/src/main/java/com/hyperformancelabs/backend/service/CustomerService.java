package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CustomerDTO;

public interface CustomerService {

    CustomerDTO getCustomerById(Integer customerId);

    CustomerDTO getCustomerByUsername(String username);
}
