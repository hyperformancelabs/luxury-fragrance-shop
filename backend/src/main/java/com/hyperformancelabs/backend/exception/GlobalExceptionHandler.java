package com.hyperformancelabs.backend.exception;

import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(new ApiResponse<>(
                        ApiResponseStatus.BAD_REQUEST_CODE,
                        ApiResponseStatus.ERROR_STATUS,
                        "Định dạng dữ liệu không được hỗ trợ. Vui lòng sử dụng JSON.",
                        null
                ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(
                        ApiResponseStatus.BAD_REQUEST_CODE,
                        ApiResponseStatus.ERROR_STATUS,
                        "Dữ liệu không đúng định dạng JSON hoặc thiếu thông tin bắt buộc.",
                        null
                ));
    }

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
