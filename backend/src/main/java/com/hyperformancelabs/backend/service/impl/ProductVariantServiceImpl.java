package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductVariantCreateRequest;
import com.hyperformancelabs.backend.dto.ProductVariantDTO;
import com.hyperformancelabs.backend.dto.ProductVariantListResponse;
import com.hyperformancelabs.backend.dto.ProductVariantUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.repository.ProductVariantRepository;
import com.hyperformancelabs.backend.service.ProductVariantService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {

    private static final Logger logger = LoggerFactory.getLogger(ProductVariantServiceImpl.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Override
    @PreAuthorize("hasAuthority('product.view')")
    @Transactional(readOnly = true)
    public ProductVariantListResponse getProductVariants(Integer productId, int page, int size, 
                                                String sortBy, Sort.Direction sortDirection, 
                                                Map<String, String> filters) {
        try {
            logger.info("Lấy danh sách biến thể cho sản phẩm ID={}, page={}, size={}, sortBy={}, sortDirection={}, filters={}", 
                productId, page, size, sortBy, sortDirection, filters);
            
            // Tìm sản phẩm
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Tạo đối tượng Sort
            Sort sort = Sort.by(sortDirection, sortBy);
            
            // Tạo đối tượng Pageable
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Áp dụng các bộ lọc và phân trang
            Page<ProductVariant> variantPage = productVariantRepository.findByProduct(product, pageable);
            
            logger.info("Tìm thấy {} biến thể", variantPage.getTotalElements());
            
            // Ánh xạ sang DTO
            List<ProductVariantDTO> variantDTOs = new ArrayList<>();
            for (ProductVariant variant : variantPage.getContent()) {
                ProductVariantDTO dto = new ProductVariantDTO();
                dto.setProductVariantId(variant.getProductVariantId());
                dto.setProductId(product.getProductId());
                dto.setProductName(product.getProductName());
                dto.setVolume(variant.getVolume());
                dto.setPrice(variant.getPrice());
                dto.setDiscountPrice(variant.getDiscountPrice());
                dto.setQuantityInStock(variant.getQuantityInStock());
                dto.setReorderLevel(variant.getReorderLevel());
                
                variantDTOs.add(dto);
            }
            
            // Tạo response
            ProductVariantListResponse response = new ProductVariantListResponse(
                variantDTOs,
                variantPage.getTotalElements(),
                variantPage.getTotalPages(),
                variantPage.getNumber()
            );
            
            return response;
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách biến thể cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.view')")
    @Transactional(readOnly = true)
    public ProductVariantDTO getProductVariant(Integer productId, Integer variantId) {
        try {
            logger.info("Lấy chi tiết biến thể với ID: {} cho sản phẩm ID: {}", variantId, productId);
            
            // Tìm sản phẩm
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Tìm biến thể
            ProductVariant variant = productVariantRepository.findByProductAndProductVariantId(product, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể không tồn tại với ID: " + variantId 
                    + " cho sản phẩm ID: " + productId));
            
            // Ánh xạ sang DTO
            ProductVariantDTO dto = new ProductVariantDTO();
            dto.setProductVariantId(variant.getProductVariantId());
            dto.setProductId(product.getProductId());
            dto.setProductName(product.getProductName());
            dto.setVolume(variant.getVolume());
            dto.setPrice(variant.getPrice());
            dto.setDiscountPrice(variant.getDiscountPrice());
            dto.setQuantityInStock(variant.getQuantityInStock());
            dto.setReorderLevel(variant.getReorderLevel());
            
            return dto;
        } catch (Exception e) {
            logger.error("Lỗi khi lấy chi tiết biến thể với ID: " + variantId + " cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.create')")
    @Transactional
    public ProductVariantDTO createProductVariant(Integer productId, ProductVariantCreateRequest request) {
        try {
            logger.info("Tạo biến thể mới cho sản phẩm ID: {} với volume: {}", productId, request.getVolume());
            
            // Tìm sản phẩm
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Kiểm tra xem biến thể với volume này đã tồn tại chưa
            if (productVariantRepository.existsByProductAndVolume(product, request.getVolume())) {
                throw new DuplicateResourceException("Biến thể với volume " + request.getVolume() + 
                    " đã tồn tại cho sản phẩm: " + product.getProductName());
            }
            
            // Tạo biến thể mới
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setVolume(request.getVolume());
            variant.setPrice(request.getPrice());
            variant.setDiscountPrice(request.getDiscountPrice());
            variant.setQuantityInStock(request.getQuantityInStock());
            variant.setReorderLevel(request.getReorderLevel());
            
            // Lưu vào cơ sở dữ liệu
            ProductVariant savedVariant = productVariantRepository.save(variant);
            logger.info("Đã tạo biến thể với ID: {}", savedVariant.getProductVariantId());
            
            // Ánh xạ sang DTO và trả về
            ProductVariantDTO dto = new ProductVariantDTO();
            dto.setProductVariantId(savedVariant.getProductVariantId());
            dto.setProductId(product.getProductId());
            dto.setProductName(product.getProductName());
            dto.setVolume(savedVariant.getVolume());
            dto.setPrice(savedVariant.getPrice());
            dto.setDiscountPrice(savedVariant.getDiscountPrice());
            dto.setQuantityInStock(savedVariant.getQuantityInStock());
            dto.setReorderLevel(savedVariant.getReorderLevel());
            
            return dto;
        } catch (Exception e) {
            logger.error("Lỗi khi tạo biến thể cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.edit')")
    @Transactional
    public ProductVariantDTO updateProductVariant(Integer productId, Integer variantId, 
                                           ProductVariantUpdateRequest request) {
        try {
            logger.info("Cập nhật biến thể với ID: {} cho sản phẩm ID: {}", variantId, productId);
            
            // Tìm sản phẩm
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Tìm biến thể
            ProductVariant variant = productVariantRepository.findByProductAndProductVariantId(product, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể không tồn tại với ID: " + variantId 
                    + " cho sản phẩm ID: " + productId));
            
            // Kiểm tra xem có đang cập nhật volume và volume mới đã tồn tại chưa
            if (request.getVolume() != null && !request.getVolume().equals(variant.getVolume())) {
                if (productVariantRepository.existsByProductAndVolume(product, request.getVolume())) {
                    throw new DuplicateResourceException("Biến thể với volume " + request.getVolume() + 
                        " đã tồn tại cho sản phẩm: " + product.getProductName());
                }
                variant.setVolume(request.getVolume());
            }
            
            // Cập nhật thông tin biến thể
            if (request.getPrice() != null) {
                variant.setPrice(request.getPrice());
            }
            
            if (request.getDiscountPrice() != null) {
                variant.setDiscountPrice(request.getDiscountPrice());
            }
            
            if (request.getQuantityInStock() != null) {
                variant.setQuantityInStock(request.getQuantityInStock());
            }
            
            if (request.getReorderLevel() != null) {
                variant.setReorderLevel(request.getReorderLevel());
            }
            
            // Lưu biến thể đã cập nhật
            ProductVariant updatedVariant = productVariantRepository.save(variant);
            logger.info("Đã cập nhật biến thể với ID: {}", updatedVariant.getProductVariantId());
            
            // Ánh xạ sang DTO và trả về
            ProductVariantDTO dto = new ProductVariantDTO();
            dto.setProductVariantId(updatedVariant.getProductVariantId());
            dto.setProductId(product.getProductId());
            dto.setProductName(product.getProductName());
            dto.setVolume(updatedVariant.getVolume());
            dto.setPrice(updatedVariant.getPrice());
            dto.setDiscountPrice(updatedVariant.getDiscountPrice());
            dto.setQuantityInStock(updatedVariant.getQuantityInStock());
            dto.setReorderLevel(updatedVariant.getReorderLevel());
            
            return dto;
        } catch (Exception e) {
            logger.error("Lỗi khi cập nhật biến thể với ID: " + variantId + " cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.delete')")
    @Transactional
    public void deleteProductVariant(Integer productId, Integer variantId) {
        try {
            logger.info("Xóa biến thể với ID: {} cho sản phẩm ID: {}", variantId, productId);
            
            // Tìm sản phẩm
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Tìm biến thể
            ProductVariant variant = productVariantRepository.findByProductAndProductVariantId(product, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể không tồn tại với ID: " + variantId 
                    + " cho sản phẩm ID: " + productId));
            
            // Xóa biến thể
            productVariantRepository.delete(variant);
            logger.info("Đã xóa biến thể với ID: {}", variantId);
        } catch (Exception e) {
            logger.error("Lỗi khi xóa biến thể với ID: " + variantId + " cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
} 