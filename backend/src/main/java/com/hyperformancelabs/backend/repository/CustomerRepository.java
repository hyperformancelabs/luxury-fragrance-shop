package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phone);
    Optional<Customer> findByUsername(String username);
    Optional<Customer> findById(Integer customerId);
    
    @Query(value = """
    SELECT COUNT(*)
    FROM [Customer] c
    WHERE c.create_at >= CONVERT(DATETIME, :startDate, 103)
        AND c.create_at < DATEADD(DAY, 1, CONVERT(DATETIME, :endDate, 103))
    """, nativeQuery = true)
    Integer getNewCustomersCountByDateRange(
        @Param("startDate") String startDate,  // format: dd/MM/yyyy
        @Param("endDate") String endDate       // format: dd/MM/yyyy
    );
}

