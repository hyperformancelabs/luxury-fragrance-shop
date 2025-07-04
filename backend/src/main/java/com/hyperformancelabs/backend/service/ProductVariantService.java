package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.ProductVariantCreateRequest;
import com.hyperformancelabs.backend.dto.ProductVariantDTO;
import com.hyperformancelabs.backend.dto.ProductVariantListResponse;
import com.hyperformancelabs.backend.dto.ProductVariantUpdateRequest;
import org.springframework.data.domain.Sort;

import java.util.Map;

public interface ProductVariantService {
    /**
     * Lấy tất cả biến thể của một sản phẩm với phân trang
     *
     * @param productId        ID của sản phẩm
     * @param page             Số trang (bắt đầu từ 0)
     * @param size             Kích thước trang
     * @param sortBy           Trường sắp xếp
     * @param sortDirection    Hướng sắp xếp (ASC/DESC)
     * @param filters          Map các điều kiện lọc
     * @return                 ProductVariantListResponse chứa danh sách biến thể và thông tin phân trang
     */
    ProductVariantListResponse getProductVariants(Integer productId, int page, int size, 
                                                  String sortBy, Sort.Direction sortDirection, 
                                                  Map<String, String> filters);
    
    /**
     * Lấy chi tiết một biến thể sản phẩm
     *
     * @param productId        ID của sản phẩm
     * @param variantId        ID của biến thể
     * @return                 Thông tin chi tiết biến thể
     */
    ProductVariantDTO getProductVariant(Integer productId, Integer variantId);
    
    /**
     * Tạo mới biến thể sản phẩm
     *
     * @param productId        ID của sản phẩm
     * @param request          Thông tin yêu cầu tạo biến thể
     * @return                 Thông tin biến thể đã tạo
     */
    ProductVariantDTO createProductVariant(Integer productId, ProductVariantCreateRequest request);
    
    /**
     * Cập nhật biến thể sản phẩm
     *
     * @param productId        ID của sản phẩm
     * @param variantId        ID của biến thể
     * @param request          Thông tin yêu cầu cập nhật
     * @return                 Thông tin biến thể đã cập nhật
     */
    ProductVariantDTO updateProductVariant(Integer productId, Integer variantId, 
                                           ProductVariantUpdateRequest request);
    
    /**
     * Xóa biến thể sản phẩm
     *
     * @param productId        ID của sản phẩm
     * @param variantId        ID của biến thể
     */
    void deleteProductVariant(Integer productId, Integer variantId);
} 