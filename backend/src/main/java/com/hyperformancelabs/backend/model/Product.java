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
}