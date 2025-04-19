package com.hyperformancelabs.backend.repository.impl;

import com.hyperformancelabs.backend.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}

