package com.hyperformancelabs.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final ApiConfig apiConfig;

    @Autowired
    public WebConfig(ApiConfig apiConfig) {
        this.apiConfig = apiConfig;
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix(apiConfig.getApiPrefix(), c ->
                c.isAnnotationPresent(RestController.class)
        );
    }
}
