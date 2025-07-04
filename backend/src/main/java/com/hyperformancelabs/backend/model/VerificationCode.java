package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_code")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_id")
    private Integer id;
    
    @Column(name = "code", nullable = false)
    private String code;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "type", nullable = false)
    private String type;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "used", nullable = false)
    private Boolean used;
    
    @Column(name = "user_type", nullable = false)
    private String userType;
    
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "metadata")
    private String metadata;
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean isValid() {
        return !used && !isExpired();
    }
}
