package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.EmployeeRegisterRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.repository.EmployeeRepository;
import com.hyperformancelabs.backend.repository.RoleRepository;
import com.hyperformancelabs.backend.repository.EmployeeRoleRepository;
import com.hyperformancelabs.backend.service.impl.EmployeeManagementServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeManagementServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private EmployeeRoleRepository employeeRoleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeManagementServiceImpl service;

    private EmployeeRegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new EmployeeRegisterRequest();
        validRequest.setUsername("john");
        validRequest.setPassword("Password123");
        validRequest.setFullName("John Doe");
        validRequest.setPhoneNumber("0123456789");
        validRequest.setEmail("john@example.com");
        validRequest.setAddress("HCM");

        // common mock
        org.mockito.Mockito.lenient().when(passwordEncoder.encode(anyString())).thenReturn("encodedPWD");
    }

    @Test
    void createEmployee_whenDuplicateUsername_thenThrow() {
        // given
        when(employeeRepository.existsByUsername("john")).thenReturn(true);

        // then
        assertThrows(DuplicateResourceException.class, () -> service.createEmployee(validRequest));
    }

    @Test
    void createEmployee_whenDuplicateEmail_thenThrow() {
        // given
        when(employeeRepository.existsByUsername("john")).thenReturn(false);
        when(employeeRepository.existsByEmail("john@example.com")).thenReturn(true);

        // then
        assertThrows(DuplicateResourceException.class, () -> service.createEmployee(validRequest));
    }

    @Test
    void createEmployee_success() {
        // given no duplicates
        when(employeeRepository.existsByUsername("john")).thenReturn(false);
        when(employeeRepository.existsByEmail("john@example.com")).thenReturn(false);
        // lenient stubs for ignoreCase variants to avoid unnecessary stubbing warnings
        org.mockito.Mockito.lenient().when(employeeRepository.existsByUsernameIgnoreCase(anyString())).thenReturn(false);
        org.mockito.Mockito.lenient().when(employeeRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
        // mock save returns entity with id
        var saved = new com.hyperformancelabs.backend.model.Employee();
        saved.setEmployeeId(1);
        when(employeeRepository.save(org.mockito.ArgumentMatchers.any())).thenReturn(saved);

        Integer id = service.createEmployee(validRequest);

        assertNotNull(id);
        assertEquals(1, id);
    }
} 