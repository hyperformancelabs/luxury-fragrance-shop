package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByOrder(Order order);
}
