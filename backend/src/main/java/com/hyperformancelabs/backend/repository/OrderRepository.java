package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomer(Customer customer);

    @Query("""
    SELECT o FROM Order o
    LEFT JOIN FETCH o.orderItems oi
    LEFT JOIN FETCH oi.productVariant pv
    LEFT JOIN FETCH pv.product p
    LEFT JOIN FETCH p.brand
    WHERE o.orderId = :orderId
""")
    Optional<Order> findByIdWithItems(@Param("orderId") Integer orderId);

    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);
}
