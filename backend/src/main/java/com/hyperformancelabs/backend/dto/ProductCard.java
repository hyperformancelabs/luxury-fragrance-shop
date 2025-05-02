package com.hyperformancelabs.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductCard {

    private Integer productId;
    private String productName;
    private String imageUrl;
    private List<VolumePriceDTO> volumePrices;


    public ProductCard(Integer productId, String productName, String imageUrl, List<VolumePriceDTO> volumePrices) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.volumePrices = volumePrices;
    }

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
}
