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
}
