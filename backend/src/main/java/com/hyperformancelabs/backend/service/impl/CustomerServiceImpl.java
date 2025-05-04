package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.CustomerDTO;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;

public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public CustomerDTO getCustomerById(Integer customerId) {
        return customerRepository.findByCustomerId(customerId)
                .map(this::convertToCustomerDTO)
                .orElse(null);
    }

    @Override
    public CustomerDTO getCustomerByUsername(String username) {
        return customerRepository.findTopByUsernameOrderByCustomerIdDesc(username)
                .map(this::convertToCustomerDTO)
                .orElse(null);
    }

    private CustomerDTO convertToCustomerDTO(Customer customer) {
        return new CustomerDTO(
                customer.getCustomerId(),
                customer.getUsername(),
                customer.getPassword(),
                customer.getName(),
                customer.getPhoneNumber(),
                customer.getEmail(),
                customer.getStreet(),
                customer.getWard(),
                customer.getDistrict(),
                customer.getCity(),
                customer.getShippingNote(),
                customer.getNote(),
                customer.getRating(),
                customer.getStatus(),
                customer.getLoyaltyPoints(),
                customer.getCreateAt(),
                customer.getUpdateAt()
        );
    }
}
