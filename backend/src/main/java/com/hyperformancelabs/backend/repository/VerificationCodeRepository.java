package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Integer> {
    
    /**
     * Tìm mã xác thực hợp lệ (chưa sử dụng và chưa hết hạn) theo mã và loại
     */
    @Query("SELECT v FROM VerificationCode v WHERE v.code = :code AND v.type = :type AND v.used = false AND v.expiresAt > :now")
    Optional<VerificationCode> findValidCode(@Param("code") String code, @Param("type") String type, @Param("now") LocalDateTime now);
    
    /**
     * Tìm mã xác thực hợp lệ (chưa sử dụng và chưa hết hạn) theo email, loại và loại người dùng
     */
    @Query("SELECT v FROM VerificationCode v WHERE v.email = :email AND v.type = :type AND v.userType = :userType AND v.used = false AND v.expiresAt > :now ORDER BY v.createdAt DESC")
    List<VerificationCode> findValidCodesByEmailAndType(@Param("email") String email, @Param("type") String type, @Param("userType") String userType, @Param("now") LocalDateTime now);
    
    /**
     * Vô hiệu hóa tất cả các mã xác thực cũ của một email và loại cụ thể
     */
    @Modifying
    @Transactional
    @Query("UPDATE VerificationCode v SET v.used = true WHERE v.email = :email AND v.type = :type AND v.userType = :userType AND v.used = false")
    void invalidateExistingCodes(@Param("email") String email, @Param("type") String type, @Param("userType") String userType);
}
