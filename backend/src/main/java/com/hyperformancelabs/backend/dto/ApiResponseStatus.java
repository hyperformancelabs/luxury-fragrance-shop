package com.hyperformancelabs.backend.dto;

/**
 * Các hằng số định nghĩa trạng thái và mã phản hồi API
 */
public class ApiResponseStatus {
    
    // Status
    public static final String SUCCESS_STATUS = "success";
    public static final String ERROR_STATUS = "error";
    
    // Status codes
    public static final int SUCCESS_CODE = 200;
    public static final int BAD_REQUEST_CODE = 400;
    public static final int UNAUTHORIZED_CODE = 401;
    public static final int FORBIDDEN_CODE = 403;
    public static final int NOT_FOUND_CODE = 404;
    public static final int CONFLICT_CODE = 409;
    public static final int INTERNAL_SERVER_ERROR_CODE = 500;
}
