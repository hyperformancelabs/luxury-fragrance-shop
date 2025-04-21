package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a perfume product in the system.
 * Contains all details about a specific fragrance product.
 */
@Entity
@Table(name = "Product", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_Product", columnNames = {"product_name", "brand_id", "volume"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;
    
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;
    
    @Column(name = "product_name", length = 100, nullable = false)
    @NotBlank(message = "Product name is required")
    private String productName;
    
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "volume", nullable = false)
    @Min(value = 1, message = "Volume must be positive")
    private Integer volume;
    
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;
    
    @Column(name = "discount_price", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = true, message = "Discount price must be non-negative")
    private BigDecimal discountPrice;
    
    @Column(name = "quantity_in_stock", nullable = false)
    @Min(value = 0, message = "Quantity in stock must be non-negative")
    private Integer quantityInStock = 0;
    
    @Column(name = "reorder_level")
    @Min(value = 0, message = "Reorder level must be non-negative")
    private Integer reorderLevel;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private Set<ProductDetail> productDetails = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<CartItem> cartItems = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<OrderItem> orderItems = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<ProductPromotion> productPromotions = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<InventoryTransaction> inventoryTransactions = new HashSet<>();

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Integer getQuantityInStock() {
        return quantityInStock;
    }

    public void setQuantityInStock(Integer quantityInStock) {
        this.quantityInStock = quantityInStock;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<ProductDetail> getProductDetails() {
        return productDetails;
    }

    public void setProductDetails(Set<ProductDetail> productDetails) {
        this.productDetails = productDetails;
    }

    public Set<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(Set<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Set<ProductPromotion> getProductPromotions() {
        return productPromotions;
    }

    public void setProductPromotions(Set<ProductPromotion> productPromotions) {
        this.productPromotions = productPromotions;
    }

    public Set<InventoryTransaction> getInventoryTransactions() {
        return inventoryTransactions;
    }

    public void setInventoryTransactions(Set<InventoryTransaction> inventoryTransactions) {
        this.inventoryTransactions = inventoryTransactions;
    }

}