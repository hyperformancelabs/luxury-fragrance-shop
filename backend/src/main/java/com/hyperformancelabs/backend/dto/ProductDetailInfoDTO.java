package com.hyperformancelabs.backend.dto;

public class ProductDetailInfoDTO {

    private String detailName;
    private String detailValue;

    // Constructor
    public ProductDetailInfoDTO(String detailName, String detailValue) {
        this.detailName = detailName;
        this.detailValue = detailValue;
    }

    // Getters and Setters
    public String getDetailName() {
        return detailName;
    }

    public void setDetailName(String detailName) {
        this.detailName = detailName;
    }

    public String getDetailValue() {
        return detailValue;
    }

    public void setDetailValue(String detailValue) {
        this.detailValue = detailValue;
    }
}
