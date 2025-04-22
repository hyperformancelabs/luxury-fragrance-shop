package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductFilterDTO;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductDetail;
import com.hyperformancelabs.backend.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Page<ProductDTO> findProductsWithFilters(ProductFilterDTO filterDTO) {
        Specification<Product> spec = buildSpecification(filterDTO);

        Pageable pageable = createPageable(filterDTO);

        // Execute the query with the specification and pageable
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        // Map the results to DTOs
        List<ProductDTO> productDTOs = new ArrayList<>();
        for (Product product : productPage.getContent()) {
            ProductDTO dto = productMapper.toDTO(product);

            // Fetch product details separately to avoid circular reference issues
            Map<String, String> details = new HashMap<>();
            List<Object[]> detailResults = entityManager.createQuery(
                "SELECT pd.detailName, pd.detailValue FROM ProductDetail pd WHERE pd.product.productId = :productId")
                .setParameter("productId", product.getProductId())
                .getResultList();

            for (Object[] result : detailResults) {
                details.put((String) result[0], (String) result[1]);
            }
            dto.setDetails(details);

            productDTOs.add(dto);
        }

        return new PageImpl<>(productDTOs, pageable, productPage.getTotalElements());
    }

    private Specification<Product> buildSpecification(ProductFilterDTO filterDTO) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Join tables for efficient querying
            Root<Product> productRoot = root;

            // Filter by brand IDs
            if (filterDTO.getBrandIds() != null && !filterDTO.getBrandIds().isEmpty()) {
                predicates.add(productRoot.get("brand").get("brandId").in(filterDTO.getBrandIds()));
            }

            // Filter by price range
            if (filterDTO.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(productRoot.get("price"), filterDTO.getMinPrice()));
            }

            if (filterDTO.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(productRoot.get("price"), filterDTO.getMaxPrice()));
            }

            // Filter by volume
            if (filterDTO.getVolumes() != null && !filterDTO.getVolumes().isEmpty()) {
                predicates.add(productRoot.get("volume").in(filterDTO.getVolumes()));
            }

            // Filter by country of origin
            if (filterDTO.getCountriesOfOrigin() != null && !filterDTO.getCountriesOfOrigin().isEmpty()) {
                predicates.add(productRoot.get("brand").get("countryOfOrigin").in(filterDTO.getCountriesOfOrigin()));
            }

            // Handle ProductDetail filters using subqueries for better performance
            if (filterDTO.getToneScents() != null && !filterDTO.getToneScents().isEmpty()) {
                predicates.add(buildDetailSubquery(query, cb, "tone_scent", filterDTO.getToneScents()));
            }

            if (filterDTO.getStyles() != null && !filterDTO.getStyles().isEmpty()) {
                predicates.add(buildDetailSubquery(query, cb, "style", filterDTO.getStyles()));
            }

            if (filterDTO.getSuitableGenders() != null && !filterDTO.getSuitableGenders().isEmpty()) {
                predicates.add(buildDetailSubquery(query, cb, "suitable_gender", filterDTO.getSuitableGenders()));
            }

            // For keyset pagination (if implemented)
            if (filterDTO.getLastSeenProductId() != null && filterDTO.getLastSeenValue() != null &&
                filterDTO.getSortBy() != null) {
                predicates.add(buildKeysetPaginationPredicate(productRoot, cb, filterDTO));
            }

            // Combine all predicates with AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Predicate buildDetailSubquery(CriteriaQuery<?> query, CriteriaBuilder cb,
                                         String detailName, List<String> detailValues) {
        // Create a subquery for each detail filter
        Subquery<Integer> subquery = query.subquery(Integer.class);
        Root<ProductDetail> subRoot = subquery.from(ProductDetail.class);

        subquery.select(subRoot.get("product").get("productId"))
                .where(
                    cb.and(
                        cb.equal(subRoot.get("detailName"), detailName),
                        subRoot.get("detailValue").in(detailValues)
                    )
                );

        return cb.in(query.getRoots().iterator().next().get("productId")).value(subquery);
    }

    private Predicate buildKeysetPaginationPredicate(Root<Product> root, CriteriaBuilder cb,
                                                   ProductFilterDTO filterDTO) {
        // Implementation for keyset pagination
        String sortBy = filterDTO.getSortBy();
        boolean isAsc = "asc".equalsIgnoreCase(filterDTO.getSortDirection());

        if ("price".equals(sortBy)) {
            if (isAsc) {
                return cb.or(
                    cb.greaterThan(root.get(sortBy), (Comparable) filterDTO.getLastSeenValue()),
                    cb.and(
                        cb.equal(root.get(sortBy), filterDTO.getLastSeenValue()),
                        cb.greaterThan(root.get("productId"), filterDTO.getLastSeenProductId())
                    )
                );
            } else {
                return cb.or(
                    cb.lessThan(root.get(sortBy), (Comparable) filterDTO.getLastSeenValue()),
                    cb.and(
                        cb.equal(root.get(sortBy), filterDTO.getLastSeenValue()),
                        cb.greaterThan(root.get("productId"), filterDTO.getLastSeenProductId())
                    )
                );
            }
        }

        // Default to ID-based pagination if sortBy is not recognized
        return cb.greaterThan(root.get("productId"), filterDTO.getLastSeenProductId());
    }

    private Pageable createPageable(ProductFilterDTO filterDTO) {
        int page = filterDTO.getPage() != null ? filterDTO.getPage() : 0;
        int size = filterDTO.getSize() != null ? filterDTO.getSize() : 20;

        String sortBy = filterDTO.getSortBy() != null ? filterDTO.getSortBy() : "productId";
        Sort.Direction direction = "desc".equalsIgnoreCase(filterDTO.getSortDirection())
                                  ? Sort.Direction.DESC : Sort.Direction.ASC;

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctDetailValues(String detailName) {
        // Use a native query to avoid entity loading issues
        return entityManager.createQuery(
            "SELECT DISTINCT pd.detailValue FROM ProductDetail pd WHERE pd.detailName = :detailName", String.class)
            .setParameter("detailName", detailName)
            .getResultList();
    }
}
