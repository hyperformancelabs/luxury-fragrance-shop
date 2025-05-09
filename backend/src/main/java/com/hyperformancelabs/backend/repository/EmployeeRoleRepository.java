package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.model.EmployeeRole;
import com.hyperformancelabs.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface EmployeeRoleRepository extends JpaRepository<EmployeeRole, Integer> {
    List<EmployeeRole> findAllByEmployee(Employee employee);

    Optional<EmployeeRole> findByEmployeeAndRole(Employee employee, Role role);
    
    /**
     * Đếm số nhân viên cho mỗi vai trò
     * @return Danh sách các vai trò với số lượng nhân viên tương ứng
     */
    @Query("SELECT er.role.roleId as roleId, COUNT(er.employee) as employeeCount FROM EmployeeRole er GROUP BY er.role.roleId")
    List<Map<String, Object>> countEmployeesByRole();
}
