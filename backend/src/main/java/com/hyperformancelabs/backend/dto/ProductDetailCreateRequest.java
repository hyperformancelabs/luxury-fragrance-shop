package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailCreateRequest {
    
    @NotBlank(message = "Tên thuộc tính không được để trống")
    private String detailName;
    
    @NotBlank(message = "Giá trị thuộc tính không được để trống")
    private String detailValue;
    
    private String note;
} 