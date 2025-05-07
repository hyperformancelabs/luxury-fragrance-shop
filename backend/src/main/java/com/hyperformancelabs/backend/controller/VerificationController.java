package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ApiResponse;
import com.hyperformancelabs.backend.dto.ApiResponseStatus;
import com.hyperformancelabs.backend.dto.RequestVerificationCodeRequest;
import com.hyperformancelabs.backend.dto.VerifyCodeRequest;
import com.hyperformancelabs.backend.exception.InvalidRequestException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.VerificationCode;
import com.hyperformancelabs.backend.model.enums.UserType;
import com.hyperformancelabs.backend.model.enums.VerificationType;
import com.hyperformancelabs.backend.service.VerificationService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/verification")
public class VerificationController {
    
    private final VerificationService verificationService;
    
    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }
    
    /**
     * Yêu cầu mã xác thực qua email
     */
    @PostMapping("/request-code")
    public ResponseEntity<ApiResponse<String>> requestVerificationCode(
            @Valid @RequestBody RequestVerificationCodeRequest request,
            @RequestParam("type") String verificationType) {
        
        try {
            // Validate verification type
            VerificationType type;
            try {
                type = VerificationType.valueOf(verificationType);
            } catch (IllegalArgumentException e) {
                throw new InvalidRequestException("Loại xác thực không hợp lệ");
            }
            
            // Validate user type
            UserType userType;
            try {
                userType = UserType.valueOf(request.getUserType());
            } catch (IllegalArgumentException e) {
                throw new InvalidRequestException("Loại người dùng không hợp lệ");
            }
            
            // Send verification code
            verificationService.sendVerificationCode(
                request.getEmail(),
                type,
                userType,
                request.getUserId()
            );
            
            return ResponseEntity.ok(
                new ApiResponse<>(
                    ApiResponseStatus.SUCCESS_CODE,
                    ApiResponseStatus.SUCCESS_STATUS,
                    "Mã xác thực đã được gửi đến email của bạn",
                    null
                )
            );
        } catch (InvalidRequestException e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                    ApiResponseStatus.NOT_FOUND_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    null
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi gửi mã xác thực: " + e.getMessage(),
                    null
                )
            );
        }
    }
    
    /**
     * Xác thực mã
     */
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<Boolean>> verifyCode(
            @Valid @RequestBody VerifyCodeRequest request,
            @RequestParam("type") String verificationType) {
        
        try {
            // Validate verification type
            VerificationType type;
            try {
                type = VerificationType.valueOf(verificationType);
            } catch (IllegalArgumentException e) {
                throw new InvalidRequestException("Loại xác thực không hợp lệ");
            }
            
            // Verify code
            Optional<VerificationCode> verificationCodeOpt = verificationService.verifyCode(request.getCode(), type);
            
            if (verificationCodeOpt.isPresent()) {
                VerificationCode verificationCode = verificationCodeOpt.get();
                
                // Check if the email matches
                if (!verificationCode.getEmail().equals(request.getEmail())) {
                    return ResponseEntity.badRequest().body(
                        new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE,
                            ApiResponseStatus.ERROR_STATUS,
                            "Mã xác thực không hợp lệ cho email này",
                            false
                        )
                    );
                }
                
                return ResponseEntity.ok(
                    new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        "Mã xác thực hợp lệ",
                        true
                    )
                );
            } else {
                return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                        ApiResponseStatus.BAD_REQUEST_CODE,
                        ApiResponseStatus.ERROR_STATUS,
                        "Mã xác thực không hợp lệ hoặc đã hết hạn",
                        false
                    )
                );
            }
        } catch (InvalidRequestException e) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>(
                    ApiResponseStatus.BAD_REQUEST_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    e.getMessage(),
                    false
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(
                    ApiResponseStatus.INTERNAL_SERVER_ERROR_CODE,
                    ApiResponseStatus.ERROR_STATUS,
                    "Lỗi khi xác thực mã: " + e.getMessage(),
                    false
                )
            );
        }
    }
}
