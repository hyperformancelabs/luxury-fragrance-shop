package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    
    Optional<Employee> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    /**
     * Count the number of orders processed by an employee within a date range
     */
    @Query(value = """
        SELECT COUNT(*)
        FROM [Order] o
        WHERE o.employee_id = :employeeId
        AND o.order_status = 'delivered'
        AND o.order_date >= CONVERT(DATETIME, :startDate, 103)
        AND o.order_date < DATEADD(DAY, 1, CONVERT(DATETIME, :endDate, 103))
    """, nativeQuery = true)
    Integer countProcessedOrdersByEmployeeInDateRange(
        @Param("employeeId") Integer employeeId,
        @Param("startDate") String startDate,  // format: dd/MM/yyyy
        @Param("endDate") String endDate       // format: dd/MM/yyyy
    );
    
    /**
     * Count the number of inventory operations performed by an employee within a date range
     */
    @Query(value = """
        SELECT COUNT(*)
        FROM [InventoryTransaction] it
        WHERE it.performed_by = :employeeId
        AND it.transaction_date >= CONVERT(DATETIME, :startDate, 103)
        AND it.transaction_date < DATEADD(DAY, 1, CONVERT(DATETIME, :endDate, 103))
    """, nativeQuery = true)
    Integer countInventoryOperationsByEmployeeInDateRange(
        @Param("employeeId") Integer employeeId,
        @Param("startDate") String startDate,  // format: dd/MM/yyyy
        @Param("endDate") String endDate       // format: dd/MM/yyyy
    );
    
    /**
     * Count the number of customer support interactions by an employee within a date range
     */
    @Query(value = """
        SELECT COUNT(*)
        FROM [ChatMessage] cm
        WHERE (cm.sender_id = :employeeId AND cm.sender_type = 'employee')
        AND cm.timestamp >= CONVERT(DATETIME, :startDate, 103)
        AND cm.timestamp < DATEADD(DAY, 1, CONVERT(DATETIME, :endDate, 103))
    """, nativeQuery = true)
    Integer countCustomerSupportInteractionsByEmployeeInDateRange(
        @Param("employeeId") Integer employeeId,
        @Param("startDate") String startDate,  // format: dd/MM/yyyy
        @Param("endDate") String endDate       // format: dd/MM/yyyy
    );
    
    /**
     * Get all active employees
     */
    @Query("SELECT e FROM Employee e WHERE e.status = 'active'")
    List<Employee> findAllActiveEmployees();
    
    /**
     * Get role names for an employee
     */
    @Query("SELECT r.roleName FROM Role r JOIN r.employeeRoles er WHERE er.employee.employeeId = :employeeId AND er.status = 'active'")
    List<String> findRoleNamesByEmployeeId(@Param("employeeId") Integer employeeId);
}
