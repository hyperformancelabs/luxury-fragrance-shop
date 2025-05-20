package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.dto.EmployeeDTO;
import com.hyperformancelabs.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    // Tìm nhân viên theo username
    Optional<Employee> findByUsername(String username);

    @Query(value = """
        SELECT e.*
        FROM Employee e
        JOIN EmployeeRole er ON e.employee_id = er.employee_id
        JOIN Role r ON er.role_id = r.role_id
        JOIN RolePermission rp ON r.role_id = rp.role_id
        JOIN Permission p ON rp.permission_id = p.permission_id
        WHERE 
            (:emailOrPhone IS NOT NULL AND (e.email = :emailOrPhone OR e.phone_number = :emailOrPhone))
            AND r.role_name = 'System Admin'
            AND e.status = 'active'
            AND er.status = 'active'
            AND r.status = 'active'
        """, nativeQuery = true)
    Employee findActiveSystemAdminByEmailOrPhone(@Param("emailOrPhone") String emailOrPhone);
}
