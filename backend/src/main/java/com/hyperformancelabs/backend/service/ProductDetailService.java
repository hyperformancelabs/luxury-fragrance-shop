package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductDetailCreateRequest;
import com.hyperformancelabs.backend.dto.ProductDetailDTO;
import com.hyperformancelabs.backend.dto.ProductDetailListResponse;
import com.hyperformancelabs.backend.dto.ProductDetailUpdateRequest;

public interface ProductDetailService {
    /**
     * Lấy tất cả chi tiết của một sản phẩm
     *
     * @param productId ID của sản phẩm
     * @return Danh sách chi tiết sản phẩm
     */
    ProductDetailListResponse getProductDetails(Integer productId);
    
    /**
     * Lấy chi tiết của một sản phẩm theo ID
     *
     * @param productId ID của sản phẩm
     * @param detailId ID của chi tiết sản phẩm
     * @return Chi tiết sản phẩm
     */
    ProductDetailDTO getProductDetail(Integer productId, Integer detailId);
    
    /**
     * Tạo mới chi tiết sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param request Thông tin yêu cầu tạo chi tiết
     * @return Chi tiết sản phẩm đã tạo
     */
    ProductDetailDTO createProductDetail(Integer productId, ProductDetailCreateRequest request);
    
    /**
     * Cập nhật chi tiết sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param detailId ID của chi tiết sản phẩm
     * @param request Thông tin yêu cầu cập nhật
     * @return Chi tiết sản phẩm đã cập nhật
     */
    ProductDetailDTO updateProductDetail(Integer productId, Integer detailId, ProductDetailUpdateRequest request);
    
    /**
     * Xóa chi tiết sản phẩm
     *
     * @param productId ID của sản phẩm
     * @param detailId ID của chi tiết sản phẩm
     */
    void deleteProductDetail(Integer productId, Integer detailId);
} 