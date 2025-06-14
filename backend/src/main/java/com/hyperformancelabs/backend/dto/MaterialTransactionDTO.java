package com.hyperformancelabs.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialTransactionDTO {
    private Integer materialTransactionId;
    private Integer materialId;
    private String materialName;
    private Integer performedById;
    private String performedByName;
    private String transactionType;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime transactionDate;
    private Integer beforeQuantity;
    private Integer quantity;
    private Integer afterQuantity;
    private String reason;
    private String note;
    private BigDecimal costPrice;
} 