package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.ProductDetailCreateRequest;
import com.hyperformancelabs.backend.dto.ProductDetailDTO;
import com.hyperformancelabs.backend.dto.ProductDetailListResponse;
import com.hyperformancelabs.backend.dto.ProductDetailUpdateRequest;
import com.hyperformancelabs.backend.exception.DuplicateResourceException;
import com.hyperformancelabs.backend.exception.ResourceNotFoundException;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.model.ProductDetail;
import com.hyperformancelabs.backend.repository.ProductDetailRepository;
import com.hyperformancelabs.backend.repository.ProductRepository;
import com.hyperformancelabs.backend.service.ProductDetailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductDetailServiceImpl implements ProductDetailService {

    private static final Logger logger = LoggerFactory.getLogger(ProductDetailServiceImpl.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductDetailRepository productDetailRepository;
    
    @Override
    @PreAuthorize("hasAuthority('product.view')")
    @Transactional(readOnly = true)
    public ProductDetailListResponse getProductDetails(Integer productId) {
        try {
            logger.info("Lấy danh sách chi tiết cho sản phẩm ID={}", productId);
            
            // Kiểm tra sản phẩm tồn tại
            if (!productRepository.existsById(productId)) {
                throw new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId);
            }
            
            // Lấy danh sách chi tiết
            List<ProductDetail> details = productDetailRepository.findByProduct_ProductId(productId);
            logger.info("Tìm thấy {} chi tiết", details.size());
            
            // Chuyển đổi sang DTO
            List<ProductDetailDTO> detailDTOs = details.stream()
                .map(detail -> new ProductDetailDTO(
                    detail.getProductDetailId(),
                    productId,
                    detail.getDetailName(),
                    detail.getDetailValue(),
                    detail.getNote()
                ))
                .collect(Collectors.toList());
            
            // Tạo response
            ProductDetailListResponse response = new ProductDetailListResponse(detailDTOs, detailDTOs.size());
            
            return response;
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách chi tiết cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.view')")
    @Transactional(readOnly = true)
    public ProductDetailDTO getProductDetail(Integer productId, Integer detailId) {
        try {
            logger.info("Lấy chi tiết với ID: {} cho sản phẩm ID: {}", detailId, productId);
            
            // Tìm chi tiết
            ProductDetail detail = productDetailRepository.findByProduct_ProductIdAndProductDetailId(productId, detailId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết không tồn tại với ID: " + detailId
                    + " cho sản phẩm ID: " + productId));
            
            // Chuyển đổi sang DTO
            ProductDetailDTO dto = new ProductDetailDTO(
                detail.getProductDetailId(),
                productId,
                detail.getDetailName(),
                detail.getDetailValue(),
                detail.getNote()
            );
            
            return dto;
        } catch (Exception e) {
            logger.error("Lỗi khi lấy chi tiết với ID: " + detailId + " cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.create')")
    @Transactional
    public ProductDetailDTO createProductDetail(Integer productId, ProductDetailCreateRequest request) {
        try {
            logger.info("Tạo chi tiết mới cho sản phẩm ID: {} với tên: {}", productId, request.getDetailName());
            
            // Tìm sản phẩm
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Kiểm tra chi tiết với tên và giá trị đã tồn tại chưa
            if (productDetailRepository.existsByProductAndDetailNameAndDetailValue(
                    product, request.getDetailName(), request.getDetailValue())) {
                throw new DuplicateResourceException("Chi tiết với tên '" + request.getDetailName() + 
                    "' và giá trị '" + request.getDetailValue() + "' đã tồn tại cho sản phẩm này");
            }
            
            // Tạo chi tiết mới
            ProductDetail detail = new ProductDetail();
            detail.setProduct(product);
            detail.setDetailName(request.getDetailName());
            detail.setDetailValue(request.getDetailValue());
            detail.setNote(request.getNote());
            
            // Lưu vào cơ sở dữ liệu
            ProductDetail savedDetail = productDetailRepository.save(detail);
            logger.info("Đã tạo chi tiết với ID: {}", savedDetail.getProductDetailId());
            
            // Chuyển đổi sang DTO và trả về
            ProductDetailDTO dto = new ProductDetailDTO(
                savedDetail.getProductDetailId(),
                productId,
                savedDetail.getDetailName(),
                savedDetail.getDetailValue(),
                savedDetail.getNote()
            );
            
            return dto;
        } catch (Exception e) {
            logger.error("Lỗi khi tạo chi tiết cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.edit')")
    @Transactional
    public ProductDetailDTO updateProductDetail(Integer productId, Integer detailId, ProductDetailUpdateRequest request) {
        try {
            logger.info("Cập nhật chi tiết với ID: {} cho sản phẩm ID: {}", detailId, productId);
            
            // Tìm sản phẩm
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
            
            // Tìm chi tiết
            ProductDetail detail = productDetailRepository.findByProduct_ProductIdAndProductDetailId(productId, detailId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết không tồn tại với ID: " + detailId
                    + " cho sản phẩm ID: " + productId));
            
            // Nếu detailName thay đổi, kiểm tra trùng lặp
            if (request.getDetailName() != null && !request.getDetailName().equals(detail.getDetailName())) {
                if (productDetailRepository.existsByProductAndDetailNameAndDetailValue(
                        product, request.getDetailName(), request.getDetailValue() != null ? 
                        request.getDetailValue() : detail.getDetailValue())) {
                    throw new DuplicateResourceException("Chi tiết với tên '" + request.getDetailName() + 
                        "' và giá trị '" + (request.getDetailValue() != null ? 
                        request.getDetailValue() : detail.getDetailValue()) + "' đã tồn tại cho sản phẩm này");
                }
                detail.setDetailName(request.getDetailName());
            }
            
            // Cập nhật thông tin
            if (request.getDetailValue() != null) {
                detail.setDetailValue(request.getDetailValue());
            }
            
            if (request.getNote() != null) {
                detail.setNote(request.getNote());
            }
            
            // Lưu vào cơ sở dữ liệu
            ProductDetail updatedDetail = productDetailRepository.save(detail);
            logger.info("Đã cập nhật chi tiết với ID: {}", updatedDetail.getProductDetailId());
            
            // Chuyển đổi sang DTO và trả về
            ProductDetailDTO dto = new ProductDetailDTO(
                updatedDetail.getProductDetailId(),
                productId,
                updatedDetail.getDetailName(),
                updatedDetail.getDetailValue(),
                updatedDetail.getNote()
            );
            
            return dto;
        } catch (Exception e) {
            logger.error("Lỗi khi cập nhật chi tiết với ID: " + detailId + " cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
    
    @Override
    @PreAuthorize("hasAuthority('product.delete')")
    @Transactional
    public void deleteProductDetail(Integer productId, Integer detailId) {
        try {
            logger.info("Xóa chi tiết với ID: {} cho sản phẩm ID: {}", detailId, productId);
            
            // Tìm chi tiết
            ProductDetail detail = productDetailRepository.findByProduct_ProductIdAndProductDetailId(productId, detailId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết không tồn tại với ID: " + detailId
                    + " cho sản phẩm ID: " + productId));
            
            // Xóa chi tiết
            productDetailRepository.delete(detail);
            logger.info("Đã xóa chi tiết với ID: {}", detailId);
        } catch (Exception e) {
            logger.error("Lỗi khi xóa chi tiết với ID: " + detailId + " cho sản phẩm ID: " + productId, e);
            throw e;
        }
    }
} 