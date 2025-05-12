package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.model.EmployeeRole;
import com.hyperformancelabs.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
     * Chỉ đếm nhân viên đang hoạt động (status='active')
     * @return Danh sách các vai trò với số lượng nhân viên tương ứng
     */
    @Query("SELECT er.role.roleId as roleId, COUNT(DISTINCT er.employee) as employeeCount FROM EmployeeRole er WHERE er.employee.status = 'active' GROUP BY er.role.roleId")
    List<Map<String, Object>> countEmployeesByRole();
    
    /**
     * Lấy danh sách nhân viên theo vai trò
     * Chỉ lấy nhân viên đang hoạt động (status='active')
     * @param roleId ID của vai trò cần lấy nhân viên
     * @return Danh sách nhân viên thuộc vai trò
     */
    @Query("SELECT er.employee FROM EmployeeRole er WHERE er.role.roleId = :roleId AND er.employee.status = 'active'")
    List<Employee> findActiveEmployeesByRoleId(@Param("roleId") Integer roleId);
}
