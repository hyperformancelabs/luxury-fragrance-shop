package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Employee;
import com.hyperformancelabs.backend.model.EmployeeRole;
import com.hyperformancelabs.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRoleRepository extends JpaRepository<EmployeeRole, Integer> {
    List<EmployeeRole> findAllByEmployee(Employee employee);

    Optional<EmployeeRole> findByEmployeeAndRole(Employee employee, Role role);
}
