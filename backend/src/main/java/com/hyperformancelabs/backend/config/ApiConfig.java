package com.hyperformancelabs.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfig {

    @Value("${api.prefix}")
    private String apiPrefix;

    public String getApiPrefix() {
        return apiPrefix;
    }
}

