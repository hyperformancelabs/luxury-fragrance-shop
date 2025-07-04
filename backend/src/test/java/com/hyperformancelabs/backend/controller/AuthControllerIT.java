package com.hyperformancelabs.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hyperformancelabs.backend.dto.EmployeeLoginRequest;
import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.LoginResponse;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.config.ApiConfig;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class
})
@org.springframework.test.context.TestPropertySource(properties = {
        "api.prefix=/api/v1"
})
@org.springframework.context.annotation.Import(ApiConfig.class)
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerService customerService;

    @MockBean
    private EmployeeService employeeService;

    @MockBean
    private com.hyperformancelabs.backend.util.JwtUtil jwtUtil;

    @Test
    void registerCustomer_shouldReturnSuccess() throws Exception {
        // Arrange
        Mockito.when(customerService.register(any())).thenReturn(new com.hyperformancelabs.backend.dto.CustomerResponseDTO(1, "cus", "Cus", null, "0123"));

        RegisterRequest req = new RegisterRequest();
        req.setUsername("cus");
        req.setPassword("Password123");
        req.setName("Cus");
        req.setPhoneNumber("0123");

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/register")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(ApiResponseStatus.SUCCESS_STATUS));
    }

    @Test
    void loginCustomer_shouldReturnToken() throws Exception {
        Mockito.when(customerService.loginAndGenerateToken(any())).thenReturn("mockToken");

        LoginRequest req = new LoginRequest();
        req.setUsername("cus");
        req.setPassword("Password123");

        mockMvc.perform(post("/api/v1/auth/login")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value("mockToken"));
    }

    @Test
    void loginEmployee_shouldReturnLoginResponse() throws Exception {
        LoginResponse resp = new LoginResponse();
        resp.setAccessToken("jwt");
        resp.setId(1L);
        resp.setUsername("john");

        Mockito.when(employeeService.login(any())).thenReturn(resp);

        EmployeeLoginRequest req = new EmployeeLoginRequest();
        req.setUsername("john");
        req.setPassword("Password123");

        mockMvc.perform(post("/api/v1/auth/emp/login")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("jwt"));
    }
} 