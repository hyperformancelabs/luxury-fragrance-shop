package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.CustomerDTO;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
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

    @Override
    public void updateCustomer(CustomerDTO customer) {
        Customer customerEntity = customerRepository.findByCustomerId(customer.getCustomerId()).orElse(null);
        if (customerEntity == null) {
            return;
        }

        customerEntity.setName(customer.getName());
        customerEntity.setPhoneNumber(customer.getPhoneNumber());
        customerEntity.setEmail(customer.getEmail());
        customerEntity.setPassword(customer.getPassword());
        customerEntity.setStreet(customer.getStreet());
        customerEntity.setWard(customer.getWard());
        customerEntity.setDistrict(customer.getDistrict());
        customerEntity.setCity(customer.getCity());
        customerEntity.setShippingNote(customer.getShippingNote());
        customerEntity.setNote(customer.getNote());
        customerEntity.setRating(customer.getRating());
        customerEntity.setStatus(customer.getStatus());
        customerEntity.setLoyaltyPoints(customer.getLoyaltyPoints());
        customerEntity.setUpdateAt(LocalDateTime.now());
        customerRepository.save(customerEntity);
    }

    @Override
    public CustomerDTO getCustomerByEmailOrPhone(String email, String phone) {
        return customerRepository.findByEmailOrPhoneNumber(email, phone)
                .map(this::convertToCustomerDTO)
                .orElse(null);
    }

    // -------------------------------------------------- ADMIN -----------------------------------------------------

    @Override
    public Long countNewCustomersToday(){
        return customerRepository.countCustomersToday();
    }

    @Override
    public Long countNewCustomersThisMonth(){
        return customerRepository.countCustomersThisMonth();
    }

    @Override
    public Long countNewCustomersThisYear(){
        return customerRepository.countCustomersThisYear();
    }

    @Override
    public Long countNewCustomersByMonthAndYear(int month, int year){
        return customerRepository.countCustomersByMonthAndYear(month, year);
    }

    @Override
    public Long countNewCustomersBetweenDates(LocalDate startDate, LocalDate endDate){
        return customerRepository.countCustomersBetweenDates(startDate, endDate);
    }

    @Override
    public void updateCustomerInfo(String customerId, String name, String email, String phoneNumber) {
        Customer customer = customerRepository.findByCustomerId(Integer.parseInt(customerId)).orElse(null);
        if (customer == null) {
            return;
        }
        customer.setName(name);
        customer.setEmail(email);
        customer.setPhoneNumber(phoneNumber);
        customerRepository.save(customer);
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
