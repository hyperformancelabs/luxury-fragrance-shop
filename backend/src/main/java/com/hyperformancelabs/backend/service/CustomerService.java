package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.CustomerResponseDTO;
import com.hyperformancelabs.backend.dto.GetAllCustomer;
import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.model.Customer;

import java.util.List;
import java.util.Map;

public interface CustomerService {
    //
//    List<GetAllCustomer> getAllCustomers();
     CustomerResponseDTO register(RegisterRequest request);
//    Customer register(RegisterRequest request);

    Customer login(LoginRequest request);

    String loginAndGenerateToken(LoginRequest request);

    Customer getCustomerByUsername(String username);

    void changePassword(String username, String oldPassword, String newPassword);
    
    // Phương thức mới để lấy số lượng khách hàng mới trong khoảng thời gian
    Integer getNewCustomersCountByDateRange(String startDate, String endDate);
    
    /**
     * Lấy số lượng khách hàng mới trong kỳ trước với cùng độ dài thời gian
     * @param startDate Ngày bắt đầu của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @param endDate Ngày kết thúc của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @return Số lượng khách hàng mới trong kỳ trước
     */
    Integer getNewCustomersCountInPreviousPeriod(String startDate, String endDate);
    
    /**
     * Lấy số lượng khách hàng mới và phần trăm thay đổi so với kỳ trước
     * @param startDate Ngày bắt đầu của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @param endDate Ngày kết thúc của kỳ hiện tại (định dạng dd/MM/yyyy)
     * @return Map chứa số lượng khách hàng mới và phần trăm thay đổi
     */
    Map<String, Object> getNewCustomersCountWithPercentChange(String startDate, String endDate);

    // NEW METHODS: admin listing & search
    com.hyperformancelabs.backend.dto.CustomerListResponse getAllCustomers(int page, int size, String sortBy, org.springframework.data.domain.Sort.Direction sortDirection, java.util.Map<String, String> filters);

    com.hyperformancelabs.backend.dto.CustomerListResponse searchCustomers(String keyword, int page, int size);

    com.hyperformancelabs.backend.dto.CustomerDTO getCustomerById(Integer customerId);
    com.hyperformancelabs.backend.dto.CustomerDTO createCustomer(com.hyperformancelabs.backend.dto.CustomerCreateRequest request);
    com.hyperformancelabs.backend.dto.CustomerDTO updateCustomer(Integer customerId, com.hyperformancelabs.backend.dto.CustomerUpdateRequest request);
    void deleteCustomer(Integer customerId);

    com.hyperformancelabs.backend.dto.CustomerDTO updateCustomerStatus(Integer customerId, String status);
    com.hyperformancelabs.backend.dto.CustomerDTO updateCustomerRating(Integer customerId, Integer rating);
    com.hyperformancelabs.backend.dto.CustomerDTO adjustLoyaltyPoints(Integer customerId, Integer delta);

    java.util.List<com.hyperformancelabs.backend.dto.CustomerPaymentMethodDTO> getPaymentMethods(Integer customerId);
    com.hyperformancelabs.backend.dto.CustomerPaymentMethodDTO addPaymentMethod(Integer customerId, com.hyperformancelabs.backend.dto.CustomerPaymentMethodCreateRequest request);
    com.hyperformancelabs.backend.dto.CustomerPaymentMethodDTO updatePaymentMethod(Integer customerId, Integer cpmId, com.hyperformancelabs.backend.dto.CustomerPaymentMethodUpdateRequest request);
    void setDefaultPaymentMethod(Integer customerId, Integer cpmId);
    void deletePaymentMethod(Integer customerId, Integer cpmId);

    com.hyperformancelabs.backend.dto.CartListResponse getCarts(Integer customerId, String status, int page, int size);
    com.hyperformancelabs.backend.dto.CartDTO getCartDetail(Integer customerId, Integer cartId);

    java.util.List<com.hyperformancelabs.backend.dto.WishlistDTO> getWishlist(Integer customerId);
    void deleteWishlistItem(Integer customerId, Integer wishlistId);

    java.util.List<com.hyperformancelabs.backend.dto.ConversationDTO> getConversations(Integer customerId);
    com.hyperformancelabs.backend.dto.ConversationDetailDTO getConversationDetail(Integer customerId, Integer convId);
}
