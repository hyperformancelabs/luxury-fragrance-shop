package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "ProductDetail", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_ProductDetail", columnNames = {"product_id", "detail_name", "detail_value"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_detail_id")
    private Integer productDetailId;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(name = "detail_name", length = 50, nullable = false)
    private String detailName;
    
    @Column(name = "detail_value", length = 255, nullable = false)
    private String detailValue;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
} 