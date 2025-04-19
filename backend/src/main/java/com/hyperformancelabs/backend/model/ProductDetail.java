package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing the detailed attributes of products.
 * Stores additional product information such as top notes, middle notes, etc.
 */
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
    @NotBlank(message = "Detail name is required")
    @Pattern(regexp = "^(tone_scent|style|top_note|middle_note|base_note|longevity|projection|season|time_of_day|suitable_age|suitable_gender)$", 
            message = "Invalid detail name")
    private String detailName;
    
    @Column(name = "detail_value", length = 255, nullable = false)
    @NotBlank(message = "Detail value is required")
    private String detailValue;
    
    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
}