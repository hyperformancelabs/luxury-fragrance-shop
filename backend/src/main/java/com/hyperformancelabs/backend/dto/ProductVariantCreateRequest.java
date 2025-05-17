package com.hyperformancelabs.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantCreateRequest {
    
    @NotNull(message = "Volume không được để trống")
    @Positive(message = "Volume phải là số dương")
    private Integer volume;
    
    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá không được âm")
    private BigDecimal price;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá khuyến mãi không được âm")
    private BigDecimal discountPrice;
    
    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private Integer quantityInStock;
    
    @Min(value = 0, message = "Mức tái đặt hàng không được âm")
    private Integer reorderLevel;
} 