package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

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
    private String productName;
    
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "volume", nullable = false)
    private Integer volume;
    
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;
    
    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;
    
    @Column(name = "quantity_in_stock", nullable = false)
    private Integer quantityInStock = 0;
    
    @Column(name = "reorder_level")
    private Integer reorderLevel;
    
    @Column(name = "image_url", length = 255)
    private String imageUrl;
    
    @OneToMany(mappedBy = "product")
    private Set<ProductDetail> productDetails = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<InventoryTransaction> inventoryTransactions = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<ProductPromotion> productPromotions = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<CartItem> cartItems = new HashSet<>();
    
    @OneToMany(mappedBy = "product")
    private Set<OrderItem> orderItems = new HashSet<>();
} 