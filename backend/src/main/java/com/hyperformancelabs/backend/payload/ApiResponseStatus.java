package com.hyperformancelabs.backend.payload;

public class ApiResponseStatus {

    public static final int SUCCESS_CODE = 200;
    public static final int BAD_REQUEST_CODE = 400;
    public static final int UNAUTHORIZED_CODE = 401;
    public static final int NOT_FOUND_CODE = 404;
    public static final int CONFLICT_CODE = 409;
    public static final int INTERNAL_SERVER_ERROR_CODE = 500;

    public static final String SUCCESS_STATUS = "success";
    public static final String ERROR_STATUS = "error";

    public static final String GET_SUCCESS_MESSAGE = "Get data successfully";
    public static final String CREATE_SUCCESS_MESSAGE = "Create data successfully";
    public static final String UPDATE_SUCCESS_MESSAGE = "Update data successfully";
    public static final String DELETE_SUCCESS_MESSAGE = "Delete data successfully";

    public static final String BAD_REQUEST_MESSAGE = "Invalid request";
    public static final String UNAUTHORIZED_MESSAGE = "Unauthorized access";
    public static final String NOT_FOUND_MESSAGE = "Data not found";
    public static final String INTERNAL_SERVER_ERROR_MESSAGE = "Server error occurred";

}
