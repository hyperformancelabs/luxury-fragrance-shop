package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface  CustomerRepository extends JpaRepository<Customer, Integer> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phone);
    Optional<Customer> findTopByUsernameOrderByCustomerIdDesc(String username);
    Optional<Customer> findByCustomerId(Integer customerId);
    List<Customer> findByUsername(String username);
    Optional<Customer> findByEmailOrPhoneNumber(String email, String phone);
}

