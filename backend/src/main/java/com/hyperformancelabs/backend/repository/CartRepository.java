package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByCustomerAndStatus(Customer customer, String status);
    Optional<Cart> findByCustomer_CustomerId(Integer customerId);  // This is the correct format
    Optional<Cart> findTopByCustomerAndStatusOrderByCartIdDesc(Customer customer, String status);
    Optional<Cart> findTopBySessionIdOrderByCartIdDesc(String sessionId);
    Optional<Cart> findTopBySessionIdAndStatusOrderByCartIdDesc(String sessionId, String status);
    List<Cart> findByCustomerUsername(String username);
    List<Cart> findByCustomer_Username(String username);
    Optional<Cart> findBySessionIdAndStatus(String sessionId, String status);
}
