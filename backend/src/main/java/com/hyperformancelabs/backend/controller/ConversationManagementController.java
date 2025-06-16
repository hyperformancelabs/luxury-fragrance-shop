package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ConversationDTO;
import com.hyperformancelabs.backend.dto.ConversationDetailDTO;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emp/customers/{customerId}/conversations")
public class ConversationManagementController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<List<ConversationDTO>>> getConversations(@PathVariable Integer customerId) {
        try {
            List<ConversationDTO> list = customerService.getConversations(customerId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }

    @GetMapping("/{convId}")
    @PreAuthorize("hasAuthority('customer.view')")
    public ResponseEntity<ApiResponse<ConversationDetailDTO>> getConversationDetail(@PathVariable Integer customerId, @PathVariable Integer convId) {
        try {
            ConversationDetailDTO dto = customerService.getConversationDetail(customerId, convId);
            return ResponseEntity.ok(new ApiResponse<>(ApiResponseStatus.SUCCESS_CODE, ApiResponseStatus.SUCCESS_STATUS, ApiResponseStatus.GET_SUCCESS_MESSAGE, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(ApiResponseStatus.BAD_REQUEST_CODE, ApiResponseStatus.ERROR_STATUS, e.getMessage(), null));
        }
    }
} 