package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Brand;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductDetail;
import com.hyperformancelabs.backend.model.ProductVariant;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> buildFilter(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer volume,
            String brandName,
            String suitableGender,
            String style,
            String toneScent
    ) {
        return (root, query, cb) -> {
            query.distinct(true);

            Join<Product, ProductVariant> variantJoin = root.join("productVariants", JoinType.LEFT);
            Join<Product, Brand> brandJoin = root.join("brand", JoinType.LEFT);

            List<Predicate> predicates = new ArrayList<>();

            if (minPrice != null) {
                predicates.add(cb.ge(variantJoin.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.le(variantJoin.get("price"), maxPrice));
            }

            if (volume != null) {
                predicates.add(cb.equal(variantJoin.get("volume"), volume));
            }

            if (brandName != null && !brandName.isBlank()) {
                predicates.add(cb.equal(cb.lower(brandJoin.get("brandName")), brandName.toLowerCase()));
            }

            // 🔁 JOIN 3 lần riêng biệt theo detailName
            if (suitableGender != null) {
                Join<Product, ProductDetail> genderJoin = root.join("productDetails", JoinType.LEFT);
                predicates.add(cb.and(
                        cb.equal(cb.lower(genderJoin.get("detailName")), "suitable_gender"),
                        cb.equal(cb.lower(genderJoin.get("detailValue")), suitableGender.toLowerCase())
                ));
            }

            if (style != null) {
                Join<Product, ProductDetail> styleJoin = root.join("productDetails", JoinType.LEFT);
                predicates.add(cb.and(
                        cb.equal(cb.lower(styleJoin.get("detailName")), "style"),
                        cb.equal(cb.lower(styleJoin.get("detailValue")), style.toLowerCase())
                ));
            }

            if (toneScent != null) {
                Join<Product, ProductDetail> toneJoin = root.join("productDetails", JoinType.LEFT);
                predicates.add(cb.and(
                        cb.equal(cb.lower(toneJoin.get("detailName")), "tone_scent"),
                        cb.equal(cb.lower(toneJoin.get("detailValue")), toneScent.toLowerCase())
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
