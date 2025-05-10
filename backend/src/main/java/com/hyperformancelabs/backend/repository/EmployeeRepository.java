package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.dto.EmployeeDTO;
import com.hyperformancelabs.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    // Tìm nhân viên theo username
    Optional<EmployeeDTO> findByUsername(String username);
}
