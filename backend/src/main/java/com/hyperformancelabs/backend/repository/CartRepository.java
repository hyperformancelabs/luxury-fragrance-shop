package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    // Lấy tất cả carts của 1 customer
    List<Cart> findByCustomer(Customer customer);

    // Nếu cần lấy theo session_id (cho user chưa login)
    Optional<Cart> findBySessionId(String sessionId);
}
