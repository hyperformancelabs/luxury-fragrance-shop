package com.hyperformancelabs.backend.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.hyperformancelabs.backend.dto.request.analytics.LlmQueryRequest;
import com.hyperformancelabs.backend.dto.response.analytics.ChartResponse;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.LlmService;
import com.hyperformancelabs.backend.service.SqlExecutionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emp/llm")
public class LlmController {

    @Autowired
    private LlmService llmService;

    @Autowired
    private SqlExecutionService sqlExecutionService;

    private final Gson gson = new Gson();

    /**
     * Generate SQL chart metadata from natural language question using LLM.
     */
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Object>> generate(@Valid @RequestBody LlmQueryRequest request) {
        try {
            String raw = llmService.generateRawResponse(request.getQuestion());
            JsonObject json = llmService.parseToJson(raw);
            if (json == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(
                                ApiResponseStatus.BAD_REQUEST_CODE,
                                ApiResponseStatus.ERROR_STATUS,
                                "LLM response is not valid JSON",
                                raw
                        ));
            }
            ChartResponse parsed = gson.fromJson(json, ChartResponse.class);

            // Execute the generated SQL to fetch data (SELECT only)
            if (parsed.getSql() != null && parsed.getSql().trim().toLowerCase().startsWith("select")) {
                Object result = sqlExecutionService.executeSql(parsed.getSql());
                if (result instanceof java.util.List) {
                    parsed.setData((java.util.List<java.util.Map<String, Object>>) result);
                }
            }

            return ResponseEntity.ok(new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Generate SQL successfully",
                    parsed
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
            ));
        }
    }
} 