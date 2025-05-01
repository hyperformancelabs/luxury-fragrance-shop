package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    // Có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần
} 