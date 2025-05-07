package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Đối tượng phản hồi API chuẩn hóa
 * 
 * @param <T> Kiểu dữ liệu của phản hồi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    /**
     * Mã trạng thái HTTP
     */
    private int code;
    
    /**
     * Trạng thái phản hồi (success/error)
     */
    private String status;
    
    /**
     * Thông báo mô tả
     */
    private String message;
    
    /**
     * Dữ liệu phản hồi
     */
    private T data;
}
