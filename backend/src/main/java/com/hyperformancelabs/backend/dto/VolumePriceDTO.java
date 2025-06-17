package com.hyperformancelabs.backend.dto;

import java.math.BigDecimal;

public class VolumePriceDTO {
    private Integer productVariantId;
    private Integer volume;
    private BigDecimal price;
    private Integer quantityInStock;

    public VolumePriceDTO(Integer productVariantId, Integer volume, BigDecimal price, Integer quantityInStock) {
        this.productVariantId = productVariantId;
        this.volume = volume;
        this.price = price;
        this.quantityInStock = quantityInStock;
    }

    public Integer getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Integer productVariantId) {
        this.productVariantId = productVariantId;
    }

    public Integer getVolume() {
        return volume;
    }

    public void setVolume(Integer volume) {
        this.volume = volume;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantityInStock() {
        return quantityInStock;
    }

    public void setQuantityInStock(Integer quantityInStock) {
        this.quantityInStock = quantityInStock;
    }
}
