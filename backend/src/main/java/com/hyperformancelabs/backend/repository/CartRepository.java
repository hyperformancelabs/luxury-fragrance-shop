package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    /**
     * Find active cart by customer
     */
    Optional<Cart> findByCustomerAndStatus(Customer customer, String status);

    /**
     * Find active cart by session ID
     */
    Optional<Cart> findBySessionIdAndStatus(String sessionId, String status);

    /**
     * Check if customer has any active cart
     */
    boolean existsByCustomerAndStatus(Customer customer, String status);

    /**
     * Check if session has any active cart
     */
    boolean existsBySessionIdAndStatus(String sessionId, String status);

    /**
     * Find cart by session ID with items eagerly loaded
     */
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems WHERE c.sessionId = :sessionId AND c.status = :status")
    Optional<Cart> findBySessionIdAndStatusWithItems(@Param("sessionId") String sessionId, @Param("status") String status);

    /**
     * Find cart by customer with items eagerly loaded
     */
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems WHERE c.customer.customerId = :customerId AND c.status = :status")
    Optional<Cart> findByCustomerIdAndStatusWithItems(@Param("customerId") Integer customerId, @Param("status") String status);
}
