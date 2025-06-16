package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.EmployeeManagementService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.*;

@WebMvcTest(controllers = EmployeeManagementController.class)
class EmployeeManagementControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeManagementService employeeManagementService;

    @Test
    void getEmployees_shouldReturnOkAndData() throws Exception {
        Map<String, Object> data = new HashMap<>();
        data.put("employees", java.util.Collections.emptyList());
        data.put("currentPage", 0);
        data.put("totalItems", 0);
        data.put("totalPages", 0);

        Mockito.when(employeeManagementService.getEmployees(anyInt(), anyInt(), any(), any(), any()))
                .thenReturn(data);

        ResultActions result = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/v1/emp/employees")
                        .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(ApiResponseStatus.SUCCESS_STATUS));
    }
} 