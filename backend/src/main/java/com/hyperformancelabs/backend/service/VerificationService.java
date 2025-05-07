package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.model.VerificationCode;
import com.hyperformancelabs.backend.model.enums.UserType;
import com.hyperformancelabs.backend.model.enums.VerificationType;

import java.util.Optional;

/**
 * Service quản lý mã xác thực
 */
public interface VerificationService {
    
    /**
     * Tạo mã xác thực mới
     * 
     * @param email Email người dùng
     * @param type Loại xác thực
     * @param userType Loại người dùng
     * @param userId ID người dùng (có thể null nếu chưa có tài khoản)
     * @param metadata Dữ liệu bổ sung (có thể null)
     * @return Mã xác thực đã tạo
     */
    VerificationCode createVerificationCode(String email, VerificationType type, UserType userType, Integer userId, String metadata);
    
    /**
     * Xác thực mã
     * 
     * @param code Mã xác thực
     * @param type Loại xác thực
     * @return Optional chứa đối tượng VerificationCode nếu hợp lệ, empty nếu không hợp lệ
     */
    Optional<VerificationCode> verifyCode(String code, VerificationType type);
    
    /**
     * Đánh dấu mã xác thực đã được sử dụng
     * 
     * @param codeId ID của mã xác thực
     */
    void markCodeAsUsed(Integer codeId);
    
    /**
     * Vô hiệu hóa tất cả các mã xác thực cũ của một email và loại cụ thể
     * 
     * @param email Email người dùng
     * @param type Loại xác thực
     * @param userType Loại người dùng
     */
    void invalidateExistingCodes(String email, VerificationType type, UserType userType);
    
    /**
     * Gửi mã xác thực qua email
     * 
     * @param email Email người dùng
     * @param type Loại xác thực
     * @param userType Loại người dùng
     * @param userId ID người dùng (có thể null nếu chưa có tài khoản)
     * @return Mã xác thực đã tạo
     */
    VerificationCode sendVerificationCode(String email, VerificationType type, UserType userType, Integer userId);
}
