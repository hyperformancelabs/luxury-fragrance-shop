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
    Optional<Customer> findByEmail(String email);
    
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
    
    /**
     * Lấy số lượng khách hàng mới trong kỳ trước với cùng độ dài thời gian
     * @param startDate Ngày bắt đầu của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @param endDate Ngày kết thúc của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @return Số lượng khách hàng mới trong kỳ trước
     */
    @Query(value = """
    SELECT COUNT(*)
    FROM [Customer] c
    WHERE c.create_at >= DATEADD(DAY, -DATEDIFF(DAY, CONVERT(DATETIME, :startDate, 103), CONVERT(DATETIME, :endDate, 103)), CONVERT(DATETIME, :startDate, 103))
        AND c.create_at < CONVERT(DATETIME, :startDate, 103)
    """, nativeQuery = true)
    Integer getNewCustomersCountInPreviousPeriod(
        @Param("startDate") String startDate,  // format: dd/MM/yyyy
        @Param("endDate") String endDate       // format: dd/MM/yyyy
    );
}

