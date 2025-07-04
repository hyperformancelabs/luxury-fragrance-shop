package com.hyperformancelabs.backend.dto.request.analytics;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LlmQueryRequest {
    @NotBlank
    private String question;
} 