package com.hyperformancelabs.backend.dto;

import java.util.List;

public class ProductDetailDTO {

    private Integer productId;
    private String productName;
    private String imageUrl;
    private List<VolumePriceDTO> volumePrices; // List of volume and price pairs
    private String country; // Country information
    private String brandName; // Brand name
    private List<ProductDetailInfoDTO> productDetails; // Product details (detail_name and detail_value)

    // Constructor
    public ProductDetailDTO(Integer productId, String productName, String imageUrl, List<VolumePriceDTO> volumePrices, String country, String brandName, List<ProductDetailInfoDTO> productDetails) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.volumePrices = volumePrices;
        this.country = country;
        this.brandName = brandName;
        this.productDetails = productDetails;
    }

    // Getters and Setters
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<VolumePriceDTO> getVolumePrices() {
        return volumePrices;
    }

    public void setVolumePrices(List<VolumePriceDTO> volumePrices) {
        this.volumePrices = volumePrices;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public List<ProductDetailInfoDTO> getProductDetails() {
        return productDetails;
    }

    public void setProductDetails(List<ProductDetailInfoDTO> productDetails) {
        this.productDetails = productDetails;
    }
}
