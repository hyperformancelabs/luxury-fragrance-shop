package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CustomerProfile;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.service.impl.CustomerServiceImpl;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerServiceImpl customerService;

    @Autowired
    private CartRepository cartRepository;


    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CustomerProfile>> getCustomerInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        CustomerProfile customer = customerService.getCustomerProfile(username);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        "Lấy thông tin thành công",
                        customer
                )
        );
    }
    @PutMapping("/me/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestParam("oldPassword") @NotBlank String oldPassword,
            @RequestParam("newPassword") @NotBlank String newPassword
    ) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        customerService.changePassword(username, oldPassword, newPassword);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        "Đổi mật khẩu thành công",
                        null
                )
        );
    }
    @GetMapping("/me/cart")
    public ResponseEntity<ApiResponse<List<Cart>>> getMyCarts() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Cart> carts = cartRepository.findByCustomerUsername(username);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponseStatus.SUCCESS_CODE,
                        ApiResponseStatus.SUCCESS_STATUS,
                        "Lấy giỏ hàng thành công",
                        carts
                )
        );
    }
    
    @GetMapping("/new-customers-count-by-date-range")
    public ResponseEntity<ApiResponse<Object>> getNewCustomersCountByDateRange(
            @RequestParam String startDate,  // format: dd/MM/yyyy
            @RequestParam String endDate     // format: dd/MM/yyyy
    ) {
        try {
            // Lấy số lượng khách hàng mới trong khoảng thời gian
            Integer newCustomersCount = customerService.getNewCustomersCountByDateRange(startDate, endDate);
            
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            ApiResponseStatus.SUCCESS_CODE,
                            ApiResponseStatus.SUCCESS_STATUS, 
                            ApiResponseStatus.GET_SUCCESS_MESSAGE,
                            java.util.Map.of("newCustomersCount", newCustomersCount)
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            ApiResponseStatus.BAD_REQUEST_CODE, 
                            ApiResponseStatus.ERROR_STATUS, 
                            "Error: " + e.getMessage(), 
                            null
                    )
            );
        }
    }
}
