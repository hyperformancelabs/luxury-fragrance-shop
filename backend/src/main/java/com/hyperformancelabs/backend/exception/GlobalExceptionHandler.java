package com.hyperformancelabs.backend.exception;

import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        return ResponseEntity.status(ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE)
                .body(new ApiResponse<>(
                        ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                        ApiResponseStatus.ERROR_STATUS,
                        ex.getMessage(),
                        null
                ));
    }
}
