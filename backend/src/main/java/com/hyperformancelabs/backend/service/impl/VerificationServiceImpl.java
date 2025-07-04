package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.model.VerificationCode;
import com.hyperformancelabs.backend.model.enums.UserType;
import com.hyperformancelabs.backend.model.enums.VerificationType;
import com.hyperformancelabs.backend.repository.VerificationCodeRepository;
import com.hyperformancelabs.backend.service.EmailService;
import com.hyperformancelabs.backend.service.VerificationService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class VerificationServiceImpl implements VerificationService {
    
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    
    @Value("${app.verification.code.expiration.minutes:15}")
    private int codeExpirationMinutes;
    
    @Value("${app.verification.code.length:6}")
    private int codeLength;
    
    public VerificationServiceImpl(VerificationCodeRepository verificationCodeRepository, EmailService emailService) {
        this.verificationCodeRepository = verificationCodeRepository;
        this.emailService = emailService;
    }
    
    @Override
    @Transactional
    public VerificationCode createVerificationCode(String email, VerificationType type, UserType userType, Integer userId, String metadata) {
        // Vô hiệu hóa các mã cũ
        invalidateExistingCodes(email, type, userType);
        
        // Tạo mã xác thực mới
        String code = generateRandomCode(codeLength);
        
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setCode(code);
        verificationCode.setEmail(email);
        verificationCode.setType(type.getValue());
        verificationCode.setCreatedAt(LocalDateTime.now());
        verificationCode.setExpiresAt(LocalDateTime.now().plusMinutes(codeExpirationMinutes));
        verificationCode.setUsed(false);
        verificationCode.setUserType(userType.getValue());
        verificationCode.setUserId(userId);
        verificationCode.setMetadata(metadata);
        
        return verificationCodeRepository.save(verificationCode);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<VerificationCode> verifyCode(String code, VerificationType type) {
        return verificationCodeRepository.findValidCode(code, type.getValue(), LocalDateTime.now());
    }
    
    @Override
    @Transactional
    public void markCodeAsUsed(Integer codeId) {
        verificationCodeRepository.findById(codeId).ifPresent(code -> {
            code.setUsed(true);
            verificationCodeRepository.save(code);
        });
    }
    
    @Override
    @Transactional
    public void invalidateExistingCodes(String email, VerificationType type, UserType userType) {
        verificationCodeRepository.invalidateExistingCodes(email, type.getValue(), userType.getValue());
    }
    
    @Override
    @Transactional
    public VerificationCode sendVerificationCode(String email, VerificationType type, UserType userType, Integer userId) {
        // Tạo mã xác thực mới
        VerificationCode verificationCode = createVerificationCode(email, type, userType, userId, null);
        
        // Gửi email với mã xác thực
        String subject = "";
        String emailTemplate = "";
        
        switch (type) {
            case PASSWORD_RESET:
                subject = "Đặt lại mật khẩu - Shop Nước Hoa Xa Xỉ";
                emailTemplate = "password-reset";
                break;
            case EMAIL_VERIFICATION:
                subject = "Xác thực email - Shop Nước Hoa Xa Xỉ";
                emailTemplate = "email-verification";
                break;
            case ACCOUNT_ACTIVATION:
                subject = "Kích hoạt tài khoản - Shop Nước Hoa Xa Xỉ";
                emailTemplate = "account-activation";
                break;
            case SECURITY_ACTION:
                subject = "Xác nhận hành động bảo mật - Shop Nước Hoa Xa Xỉ";
                emailTemplate = "security-action";
                break;
        }
        
        Map<String, Object> templateVariables = new HashMap<>();
        templateVariables.put("code", verificationCode.getCode());
        templateVariables.put("expiresAt", verificationCode.getExpiresAt());
        templateVariables.put("userType", userType.getValue());
        
        // Nếu chưa có template, sử dụng email đơn giản
        try {
            emailService.sendTemplateEmail(email, subject, emailTemplate, templateVariables);
        } catch (Exception e) {
            // Fallback to simple email if template not found
            String emailContent = buildSimpleEmailContent(verificationCode, type);
            emailService.sendSimpleEmail(email, subject, emailContent);
        }
        
        return verificationCode;
    }
    
    /**
     * Tạo mã ngẫu nhiên với độ dài cho trước
     */
    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10)); // Chỉ sử dụng số từ 0-9
        }
        return code.toString();
    }
    
    /**
     * Tạo nội dung email đơn giản khi không có template
     */
    private String buildSimpleEmailContent(VerificationCode verificationCode, VerificationType type) {
        String actionText;
        
        switch (type) {
            case PASSWORD_RESET:
                actionText = "đặt lại mật khẩu";
                break;
            case EMAIL_VERIFICATION:
                actionText = "xác thực email";
                break;
            case ACCOUNT_ACTIVATION:
                actionText = "kích hoạt tài khoản";
                break;
            case SECURITY_ACTION:
                actionText = "xác nhận hành động bảo mật";
                break;
            default:
                actionText = "xác thực";
        }
        
        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
                "<h2>Shop Nước Hoa Xa Xỉ</h2>" +
                "<p>Mã " + actionText + " của bạn là: <strong style='font-size: 18px;'>" + verificationCode.getCode() + "</strong></p>" +
                "<p>Mã này sẽ hết hạn sau " + codeExpirationMinutes + " phút.</p>" +
                "<p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>" +
                "<p>Trân trọng,<br>Shop Nước Hoa Xa Xỉ</p>" +
                "</div>";
    }
}
