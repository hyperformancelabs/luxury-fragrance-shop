package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductCreateRequest;
import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductListResponse;
import com.hyperformancelabs.backend.dto.ProductUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Brand;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.BrandRepository;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.ProductManagementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductManagementServiceImpl implements ProductManagementService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductManagementServiceImpl.class);

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Override
    @PreAuthorize("hasAuthority('product.view')")
    @Transactional(readOnly = true)
    public ProductListResponse getAllProducts(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        try {
            logger.info("Getting products page={}, size={}, sortBy={}, sortDirection={}, filters={}", 
                page, size, sortBy, sortDirection, filters);
                
            // Create sort object
            Sort sort = Sort.by(sortDirection, sortBy);
            
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Apply filters
            Page<Product> productPage;
            
            if (filters.containsKey("brandId")) {
                try {
                    Integer brandId = Integer.parseInt(filters.get("brandId"));
                    Brand brand = brandRepository.findById(brandId)
                        .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));
                    logger.info("Filtering by brand ID: {}", brandId);
                    productPage = productRepository.findByBrand(brand, pageable);
                } catch (NumberFormatException e) {
                    logger.warn("Invalid brand ID format: {}", filters.get("brandId"));
                    productPage = productRepository.findAll(pageable);
                }
            } else if (filters.containsKey("productName")) {
                String productName = filters.get("productName");
                logger.info("Filtering by product name: {}", productName);
                productPage = productRepository.findByProductNameContainingIgnoreCase(productName, pageable);
            } else {
                logger.info("No filters applied");
                productPage = productRepository.findAll(pageable);
            }
            
            logger.info("Found {} products", productPage.getTotalElements());
            
            // Map to DTOs
            List<ProductDTO> productDTOs = new ArrayList<>();
            for (Product product : productPage.getContent()) {
                ProductDTO dto = mapProductToDTO(product);
                productDTOs.add(dto);
            }
            
            // Create response
            ProductListResponse response = new ProductListResponse(
                productDTOs,
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.getNumber()
            );
            
            return response;
        } catch (Exception e) {
            logger.error("Error getting all products", e);
            throw e;
        }
    }

    @Override
    @PreAuthorize("hasAuthority('product.view')")
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Integer productId) {
        try {
            logger.info("Getting product with ID: {}", productId);
            
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            return mapProductToDTO(product);
        } catch (Exception e) {
            logger.error("Error getting product with ID: {}", productId, e);
            throw e;
        }
    }
    
    /**
     * Map Product entity to ProductDTO with variant information
     */
    private ProductDTO mapProductToDTO(Product product) {
            ProductDTO dto = new ProductDTO();
            dto.setProductId(product.getProductId());
            dto.setProductName(product.getProductName());
            dto.setDescription(product.getDescription());
            dto.setImageUrl(product.getImageUrl());
            
            // Add brand info if available
            if (product.getBrand() != null) {
                dto.setBrandId(product.getBrand().getBrandId());
                dto.setBrandName(product.getBrand().getBrandName());
            }
            
        // Get variant data
        List<ProductVariant> variants = productVariantRepository.findByProduct(product, Pageable.unpaged()).getContent();
        
        // Calculate min/max prices and inventory information
        if (!variants.isEmpty()) {
            // Giá bán (Price)
            BigDecimal minPrice = variants.stream()
                .map(ProductVariant::getPrice)
                .filter(price -> price != null)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);
                
            BigDecimal maxPrice = variants.stream()
                .map(ProductVariant::getPrice)
                .filter(price -> price != null)
                .max(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);
                
            // Giá khuyến mãi (DiscountPrice)
            BigDecimal minDiscountPrice = variants.stream()
                .map(ProductVariant::getDiscountPrice)
                .filter(price -> price != null)
                .min(Comparator.naturalOrder())
                .orElse(null);
                
            BigDecimal maxDiscountPrice = variants.stream()
                .map(ProductVariant::getDiscountPrice)
                .filter(price -> price != null)
                .max(Comparator.naturalOrder())
                .orElse(null);
                
            // Tổng tồn kho
            int totalInventory = variants.stream()
                .mapToInt(variant -> variant.getQuantityInStock() != null ? variant.getQuantityInStock() : 0)
                .sum();
                
            // Danh sách dung tích
            List<Integer> volumeList = variants.stream()
                .map(ProductVariant::getVolume)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
                
            // Cập nhật DTO
            dto.setMinPrice(minPrice);
            dto.setMaxPrice(maxPrice);
            dto.setMinDiscountPrice(minDiscountPrice);
            dto.setMaxDiscountPrice(maxDiscountPrice);
            dto.setTotalInventory(totalInventory);
            dto.setVolumes(volumeList);
            dto.setVariantCount(variants.size());
        } else {
            // Default values if no variants
            dto.setMinPrice(BigDecimal.ZERO);
            dto.setMaxPrice(BigDecimal.ZERO);
            dto.setMinDiscountPrice(null);
            dto.setMaxDiscountPrice(null);
            dto.setTotalInventory(0);
            dto.setVolumes(new ArrayList<>());
            dto.setVariantCount(0);
        }
        
        return dto;
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.create')")
    @Transactional
    public ProductDTO createProduct(ProductCreateRequest request) {
        try {
            logger.info("Creating new product with name: {}", request.getProductName());
            
            // Find brand
            Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));
            
            // Check if product with same name and brand already exists
            if (productRepository.existsByProductNameAndBrand(request.getProductName(), brand)) {
                throw new DuplicateResourceException("Product with name '" + request.getProductName() + 
                    "' already exists for brand: " + brand.getBrandName());
            }
            
            // Create new product
            Product product = new Product();
            product.setBrand(brand);
            product.setProductName(request.getProductName());
            product.setDescription(request.getDescription());
            product.setImageUrl(request.getImageUrl());
            
            // Save to database
            Product savedProduct = productRepository.save(product);
            logger.info("Created product with ID: {}", savedProduct.getProductId());
            
            // Map to DTO and return
            return mapProductToDTO(savedProduct);
        } catch (Exception e) {
            logger.error("Error creating product", e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.edit')")
    @Transactional
    public ProductDTO updateProduct(Integer productId, ProductUpdateRequest request) {
        try {
            logger.info("Updating product with ID: {}", productId);
            
            // Find existing product
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Check if brand needs to be updated
            if (request.getBrandId() != null && !request.getBrandId().equals(product.getBrand().getBrandId())) {
                Brand newBrand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));
                
                // Check for duplicate product name with new brand
                if (productRepository.existsByProductNameAndBrand(request.getProductName(), newBrand)) {
                    throw new DuplicateResourceException("Product with name '" + request.getProductName() + 
                        "' already exists for brand: " + newBrand.getBrandName());
                }
                
                product.setBrand(newBrand);
            } else if (!request.getProductName().equals(product.getProductName())) {
                // If product name is changed but brand remains the same, check for duplicates
                if (productRepository.existsByProductNameAndBrand(request.getProductName(), product.getBrand())) {
                    throw new DuplicateResourceException("Product with name '" + request.getProductName() + 
                        "' already exists for brand: " + product.getBrand().getBrandName());
                }
            }
            
            // Update product details
            product.setProductName(request.getProductName());
            product.setDescription(request.getDescription());
            product.setImageUrl(request.getImageUrl());
            
            // Save updated product
            Product updatedProduct = productRepository.save(product);
            logger.info("Updated product with ID: {}", updatedProduct.getProductId());
            
            // Map to DTO and return
            return mapProductToDTO(updatedProduct);
        } catch (Exception e) {
            logger.error("Error updating product with ID: {}", productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.delete')")
    @Transactional
    public void deleteProduct(Integer productId) {
        try {
            logger.info("Deleting product with ID: {}", productId);
            
            // Check if product exists
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Lấy tất cả biến thể của sản phẩm
            List<ProductVariant> variants = productVariantRepository.findByProduct(product, Pageable.unpaged()).getContent();
            
            // Kiểm tra xem sản phẩm có liên kết với OrderItem không
            boolean hasOrderItems = variants.stream()
                .anyMatch(variant -> !variant.getOrderItems().isEmpty());
            
            if (hasOrderItems) {
                throw new RuntimeException("Không thể xóa sản phẩm vì nó đã được đặt hàng. Hãy đánh dấu sản phẩm là ngừng kinh doanh thay vì xóa.");
            }
            
            // Kiểm tra và xóa các liên kết với giỏ hàng
            variants.forEach(variant -> {
                if (!variant.getCartItems().isEmpty()) {
                    logger.info("Removing cart items for product variant with ID: {}", variant.getProductVariantId());
                }
                // CartItems sẽ tự động bị xóa do @OneToMany với cascade = CascadeType.ALL trên ProductVariant
            });
            
            // Kiểm tra và xóa wishlist
            variants.forEach(variant -> {
                if (!variant.getWishlists().isEmpty()) {
                    logger.info("Removing wishlist items for product variant with ID: {}", variant.getProductVariantId());
                }
                // Wishlists sẽ tự động bị xóa do @OneToMany với cascade = CascadeType.ALL trên ProductVariant
            });
            
            // Delete product (các ProductVariant sẽ tự động bị xóa do @OneToMany với cascade = CascadeType.ALL trên Product)
            productRepository.delete(product);
            logger.info("Deleted product with ID: {}", productId);
        } catch (ResourceNotFoundException e) {
            logger.error("Error deleting product with ID {}: {}", productId, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error deleting product with ID {}: ", productId, e);
            throw e;
        }
    }
} 