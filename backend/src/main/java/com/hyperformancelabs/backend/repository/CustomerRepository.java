package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer>, JpaSpecificationExecutor<Customer> {
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

    // NEW CODE: listing & search for admin
    @Query("""
        SELECT c FROM Customer c
        WHERE (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))
          AND (:phone IS NULL OR c.phoneNumber LIKE CONCAT('%', :phone, '%'))
          AND (:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))
          AND (:status IS NULL OR c.status = :status)
    """)
    Page<Customer> findByFilters(@Param("name") String name,
                                 @Param("phone") String phone,
                                 @Param("email") String email,
                                 @Param("status") String status,
                                 Pageable pageable);

    @Query("""
        SELECT c FROM Customer c
        WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR c.phoneNumber LIKE CONCAT('%', :keyword, '%')
    """)
    Page<Customer> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}

