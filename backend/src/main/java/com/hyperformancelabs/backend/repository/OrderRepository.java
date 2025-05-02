package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
//    List<Order> findByCustomer(Customer customer);
//
//    Optional<Order> findByOrderId(Integer orderId);
//
//    @Query("""
//    SELECT o FROM Order o
//    LEFT JOIN FETCH o.orderItems oi
//    LEFT JOIN FETCH oi.productVariant pv
//    LEFT JOIN FETCH pv.product p
//    LEFT JOIN FETCH p.brand
//    WHERE o.orderId = :orderId
//""")
//    Optional<Order> findByIdWithItems(@Param("orderId") Integer orderId);
//
//    @Query(value = """
//    SELECT COALESCE(SUM(o.total_amount), 0)
//    FROM [Order] o
//    WHERE o.order_status = 'delivered'
//    AND o.order_date >= CAST(GETDATE() AS DATE)
//    AND o.order_date < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))
//    """, nativeQuery = true)
//    BigDecimal getTotalAmountOfDeliveredOrdersToday();
//
//    @Query(value = """
//    SELECT COALESCE(SUM(o.total_amount), 0)
//    FROM [Order] o
//    WHERE o.order_status = 'delivered'
//      AND o.order_date >= DATEADD(DAY, 1, EOMONTH(GETDATE(), -1))
//      AND o.order_date <= DATEADD(DAY, 7 - DATEPART(WEEKDAY, GETDATE()) +
//            CASE WHEN DATEPART(WEEKDAY, GETDATE()) = 1 THEN -6 ELSE 1 END, CAST(GETDATE() AS DATE))
//    """, nativeQuery = true)
//    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentWeek();
//
//    @Query(value = """
//    SELECT COALESCE(SUM(o.total_amount), 0)
//    FROM [Order] o
//    WHERE o.order_status = 'delivered'
//      AND YEAR(o.order_date) = YEAR(GETDATE())
//      AND MONTH(o.order_date) = MONTH(GETDATE())
//    """, nativeQuery = true)
//    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentMonth();
//
//    @Query(value = """
//    SELECT COALESCE(SUM(o.total_amount), 0)
//    FROM [Order] o
//    WHERE o.order_status = 'delivered'
//      AND YEAR(o.order_date) = YEAR(GETDATE())
//    """, nativeQuery = true)
//    BigDecimal getTotalAmountOfDeliveredOrdersInCurrentYear();
//
//    @Query(value = """
//    SELECT COALESCE(SUM(o.total_amount), 0)
//    FROM [Order] o
//    WHERE o.order_status = 'delivered'
//    AND o.order_date >= DATEFROMPARTS(:year, :month, 1)
//    AND o.order_date < DATEFROMPARTS(
//        CASE
//            WHEN :month = 12 THEN :year + 1
//            ELSE :year
//        END,
//        CASE
//            WHEN :month = 12 THEN 1
//            ELSE :month + 1
//        END,
//        1
//    )
//    """, nativeQuery = true)
//    BigDecimal getTotalAmountOfDeliveredOrdersByMonthAndYear(
//        @Param("month") int month,
//        @Param("year") int year
//    );
//
//    @Query(value = """
//    SELECT COALESCE(SUM(o.total_amount), 0)
//    FROM [Order] o
//    WHERE o.order_status = 'delivered'
//    AND o.order_date >= CONVERT(DATETIME, :startDate, 103)
//    AND o.order_date < DATEADD(DAY, 1, CONVERT(DATETIME, :endDate, 103))
//    """, nativeQuery = true)
//    BigDecimal getTotalAmountOfDeliveredOrdersByDateRange(
//        @Param("startDate") String startDate,  // format: dd/MM/yyyy
//        @Param("endDate") String endDate       // format: dd/MM/yyyy
//    );
//
//    @Query(value = """
//    SELECT COALESCE(SUM(o.total_amount), 0)
//    FROM [Order] o
//    WHERE o.order_status = 'delivered'
//    AND o.order_date >= DATEFROMPARTS(:year,
//        CASE :quarter
//            WHEN 1 THEN 1
//            WHEN 2 THEN 4
//            WHEN 3 THEN 7
//            WHEN 4 THEN 10
//        END,
//        1)
//    AND o.order_date < DATEFROMPARTS(
//        CASE
//            WHEN :quarter = 4 THEN :year + 1
//            ELSE :year
//        END,
//        CASE :quarter
//            WHEN 1 THEN 4
//            WHEN 2 THEN 7
//            WHEN 3 THEN 10
//            WHEN 4 THEN 1
//        END,
//        1)
//    """, nativeQuery = true)
//    BigDecimal getTotalAmountOfDeliveredOrdersByQuarterAndYear(
//        @Param("quarter") int quarter,  // 1-4
//        @Param("year") int year
//    );
}
