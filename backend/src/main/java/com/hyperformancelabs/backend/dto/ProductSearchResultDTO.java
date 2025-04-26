package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Product;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductSearchResultDTO {
    private Integer productId;
    private String productName;
    private String brandName;
    private Integer volume;
    private BigDecimal price;
    private String imageUrl;
    private Integer quantityInStock;
    
    public ProductSearchResultDTO(Product product) {
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.brandName = product.getBrand().getBrandName();
        this.volume = product.getVolume();
        this.price = product.getPrice();
        this.imageUrl = product.getImageUrl();
        this.quantityInStock = product.getQuantityInStock();
    }
}