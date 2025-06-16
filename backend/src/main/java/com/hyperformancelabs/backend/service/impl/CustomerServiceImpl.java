// --- CustomerServiceImpl.java ---
package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.CustomerProfile;
import com.hyperformancelabs.backend.dto.CustomerResponseDTO;
import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.dto.CustomerDTO;
import com.hyperformancelabs.backend.dto.CustomerListResponse;
import com.hyperformancelabs.backend.dto.CustomerCreateRequest;
import com.hyperformancelabs.backend.dto.CustomerUpdateRequest;
import com.hyperformancelabs.backend.dto.CustomerPaymentMethodDTO;
import com.hyperformancelabs.backend.dto.CustomerPaymentMethodCreateRequest;
import com.hyperformancelabs.backend.dto.CustomerPaymentMethodUpdateRequest;
import com.hyperformancelabs.backend.dto.CartDTO;
import com.hyperformancelabs.backend.dto.CartListResponse;
import com.hyperformancelabs.backend.dto.WishlistDTO;
import com.hyperformancelabs.backend.dto.ConversationDTO;
import com.hyperformancelabs.backend.dto.ConversationDetailDTO;
import com.hyperformancelabs.backend.dto.ChatMessageDTO;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.CustomerPaymentMethod;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.CustomerPaymentMethodRepository;
import com.hyperformancelabs.backend.repository.PaymentMethodRepository;
import com.hyperformancelabs.backend.repository.WishlistRepository;
import com.hyperformancelabs.backend.repository.ConversationRepository;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerPaymentMethodRepository customerPaymentMethodRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public CustomerResponseDTO register(RegisterRequest request) {
        if (customerRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty() && customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        Customer customer = new Customer();
        customer.setUsername(request.getUsername());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setName(request.getName());
        customer.setPhoneNumber(request.getPhoneNumber());

        // Chỉ set email nếu không null và không rỗng
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            customer.setEmail(request.getEmail());
        }

        customer.setCreateAt(LocalDateTime.now());
        customer.setStatus("active");
        customer.setRating(10);
        customer.setLoyaltyPoints(0);

        Customer savedCustomer = customerRepository.save(customer);

        Cart cart = new Cart();
        cart.setCustomer(savedCustomer);
        cart.setStatus("active");
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);

        return new CustomerResponseDTO(
                savedCustomer.getCustomerId(),
                savedCustomer.getUsername(),
                savedCustomer.getName(),
                savedCustomer.getEmail(),
                savedCustomer.getPhoneNumber()
        );
    }

    @Override
    public Customer login(LoginRequest request) {
        Customer customer = customerRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }

        return customer;
    }

    @Override
    public String loginAndGenerateToken(LoginRequest request) {
        Customer customer = login(request);
        // Define a default role for customers
        List<String> customerRoles = List.of("CUSTOMER"); 
        return jwtUtil.generateToken(customer.getUsername(), customerRoles);
    }

    @Override
    public Customer getCustomerByUsername(String username) {
        return customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public CustomerProfile getCustomerProfile(String username) {
        Customer customer = getCustomerByUsername(username);
        CustomerProfile dto = new CustomerProfile();

        dto.setId(customer.getCustomerId());
        dto.setUsername(customer.getUsername());
        dto.setName(customer.getName());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setEmail(customer.getEmail());
        dto.setStreet(customer.getStreet());
        dto.setWard(customer.getWard());
        dto.setDistrict(customer.getDistrict());
        dto.setCity(customer.getCity());
        dto.setShippingNote(customer.getShippingNote());
        dto.setNote(customer.getNote());
        dto.setRating(customer.getRating());
        dto.setStatus(customer.getStatus());
        dto.setLoyaltyPoints(customer.getLoyaltyPoints());
        dto.setCreateAt(customer.getCreateAt());
        dto.setUpdateAt(customer.getUpdateAt());

        return dto;
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        Customer customer = getCustomerByUsername(username);

        if (!passwordEncoder.matches(oldPassword, customer.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customerRepository.save(customer);
    }
    
    @Override
    public Integer getNewCustomersCountByDateRange(String startDate, String endDate) {
        return customerRepository.getNewCustomersCountByDateRange(startDate, endDate);
    }
    
    @Override
    public Integer getNewCustomersCountInPreviousPeriod(String startDate, String endDate) {
        return customerRepository.getNewCustomersCountInPreviousPeriod(startDate, endDate);
    }
    
    @Override
    public Map<String, Object> getNewCustomersCountWithPercentChange(String startDate, String endDate) {
        // Lấy số lượng khách hàng mới trong kỳ hiện tại
        Integer currentPeriodCount = getNewCustomersCountByDateRange(startDate, endDate);
        
        // Lấy số lượng khách hàng mới trong kỳ trước
        Integer previousPeriodCount = getNewCustomersCountInPreviousPeriod(startDate, endDate);
        
        // Tính toán phần trăm thay đổi
        double percentChange = 0.0;
        if (previousPeriodCount > 0) {
            percentChange = ((double) (currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100;
        }
        
        // Làm tròn phần trăm thay đổi đến 1 chữ số thập phân
        percentChange = Math.round(percentChange * 10) / 10.0;
        
        // Tạo kết quả trả về
        Map<String, Object> result = new HashMap<>();
        result.put("newCustomersCount", currentPeriodCount);
        result.put("previousPeriodChange", percentChange);
        
        return result;
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public CustomerListResponse getAllCustomers(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        // Build pageable
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        String name = filters.getOrDefault("name", null);
        String phone = filters.getOrDefault("phone", null);
        String email = filters.getOrDefault("email", null);
        String status = filters.getOrDefault("status", null);

        Page<Customer> customerPage;
        if (name != null || phone != null || email != null || status != null) {
            customerPage = customerRepository.findByFilters(name, phone, email, status, pageable);
        } else {
            customerPage = customerRepository.findAll(pageable);
        }

        java.util.List<CustomerDTO> dtos = customerPage.getContent().stream().map(CustomerDTO::toDTO).toList();

        return new CustomerListResponse(
                dtos,
                customerPage.getTotalElements(),
                customerPage.getTotalPages(),
                customerPage.getNumber()
        );
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public CustomerListResponse searchCustomers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<Customer> customerPage = customerRepository.searchByKeyword(keyword.trim(), pageable);
        java.util.List<CustomerDTO> dtos = customerPage.getContent().stream().map(CustomerDTO::toDTO).toList();
        return new CustomerListResponse(
                dtos,
                customerPage.getTotalElements(),
                customerPage.getTotalPages(),
                customerPage.getNumber()
        );
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public CustomerDTO getCustomerById(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id " + customerId));
        return CustomerDTO.toDTO(customer);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.create')")
    public CustomerDTO createCustomer(CustomerCreateRequest request) {
        // Validate uniqueness
        if (request.getUsername() != null && customerRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (request.getEmail() != null && !request.getEmail().isBlank() && customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        Customer customer = new Customer();
        customer.setUsername(request.getUsername());
        if (request.getPassword() != null) {
            customer.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        customer.setName(request.getName());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setEmail(request.getEmail());
        customer.setStreet(request.getStreet());
        customer.setWard(request.getWard());
        customer.setDistrict(request.getDistrict());
        customer.setCity(request.getCity());
        customer.setShippingNote(request.getShippingNote());
        customer.setNote(request.getNote());
        customer.setRating(request.getRating());
        customer.setStatus(request.getStatus());
        customer.setLoyaltyPoints(request.getLoyaltyPoints());
        customer.setCreateAt(java.time.LocalDateTime.now());

        Customer saved = customerRepository.save(customer);
        return CustomerDTO.toDTO(saved);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.edit')")
    public CustomerDTO updateCustomer(Integer customerId, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id " + customerId));

        // Uniqueness checks
        if (request.getUsername() != null && !request.getUsername().equals(customer.getUsername())
                && customerRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (request.getEmail() != null && !request.getEmail().equals(customer.getEmail())
                && customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().equals(customer.getPhoneNumber())
                && customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        if (request.getUsername() != null) customer.setUsername(request.getUsername());
        if (request.getPassword() != null) customer.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getName() != null) customer.setName(request.getName());
        if (request.getPhoneNumber() != null) customer.setPhoneNumber(request.getPhoneNumber());
        if (request.getEmail() != null) customer.setEmail(request.getEmail());
        customer.setStreet(request.getStreet());
        customer.setWard(request.getWard());
        customer.setDistrict(request.getDistrict());
        customer.setCity(request.getCity());
        customer.setShippingNote(request.getShippingNote());
        customer.setNote(request.getNote());
        if (request.getRating() != null) customer.setRating(request.getRating());
        if (request.getStatus() != null) customer.setStatus(request.getStatus());
        if (request.getLoyaltyPoints() != null) customer.setLoyaltyPoints(request.getLoyaltyPoints());

        customer.setUpdateAt(java.time.LocalDateTime.now());

        Customer updated = customerRepository.save(customer);
        return CustomerDTO.toDTO(updated);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.delete')")
    public void deleteCustomer(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id " + customerId));
        customerRepository.delete(customer);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.edit')")
    public CustomerDTO updateCustomerStatus(Integer customerId, String status) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setStatus(status);
        customer.setUpdateAt(java.time.LocalDateTime.now());
        return CustomerDTO.toDTO(customerRepository.save(customer));
    }

    @Override
    @PreAuthorize("hasAuthority('customer.edit')")
    public CustomerDTO updateCustomerRating(Integer customerId, Integer rating) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setRating(rating);
        customer.setUpdateAt(java.time.LocalDateTime.now());
        return CustomerDTO.toDTO(customerRepository.save(customer));
    }

    @Override
    @PreAuthorize("hasAuthority('customer.edit')")
    public CustomerDTO adjustLoyaltyPoints(Integer customerId, Integer delta) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        int newPoints = customer.getLoyaltyPoints() + delta;
        if (newPoints < 0) {
            newPoints = 0;
        }
        customer.setLoyaltyPoints(newPoints);
        customer.setUpdateAt(java.time.LocalDateTime.now());
        return CustomerDTO.toDTO(customerRepository.save(customer));
    }

    @Override
    @PreAuthorize("hasAuthority('customer.payment.view')")
    public java.util.List<CustomerPaymentMethodDTO> getPaymentMethods(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        java.util.List<CustomerPaymentMethodDTO> list = customer.getPaymentMethods().stream()
                .map(CustomerPaymentMethodDTO::fromEntity).toList();
        return list;
    }

    @Override
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public CustomerPaymentMethodDTO addPaymentMethod(Integer customerId, CustomerPaymentMethodCreateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        com.hyperformancelabs.backend.model.PaymentMethod pm = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        CustomerPaymentMethod cpm = new CustomerPaymentMethod();
        cpm.setCustomer(customer);
        cpm.setPaymentMethod(pm);
        cpm.setProvider(request.getProvider());
        cpm.setAccountNumber(request.getAccountNumber());
        cpm.setToken(null);
        cpm.setIsDefault(request.getIsDefault() != null && request.getIsDefault());

        if (cpm.getIsDefault()) {
            // unset other defaults
            customer.getPaymentMethods().forEach(p -> p.setIsDefault(false));
        }

        CustomerPaymentMethod saved = customerPaymentMethodRepository.save(cpm);
        return CustomerPaymentMethodDTO.fromEntity(saved);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public CustomerPaymentMethodDTO updatePaymentMethod(Integer customerId, Integer cpmId, CustomerPaymentMethodUpdateRequest request) {
        CustomerPaymentMethod cpm = customerPaymentMethodRepository.findById(cpmId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
        if (!cpm.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Payment method does not belong to customer");
        }

        if (request.getProvider() != null) cpm.setProvider(request.getProvider());
        if (request.getAccountNumber() != null) cpm.setAccountNumber(request.getAccountNumber());

        CustomerPaymentMethod saved = customerPaymentMethodRepository.save(cpm);
        return CustomerPaymentMethodDTO.fromEntity(saved);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public void setDefaultPaymentMethod(Integer customerId, Integer cpmId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.getPaymentMethods().forEach(pm -> pm.setIsDefault(pm.getCustomerPaymentMethodId().equals(cpmId)));
        customerRepository.save(customer);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.payment.edit')")
    public void deletePaymentMethod(Integer customerId, Integer cpmId) {
        CustomerPaymentMethod cpm = customerPaymentMethodRepository.findById(cpmId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
        if (!cpm.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Payment method does not belong to customer");
        }
        customerPaymentMethodRepository.delete(cpm);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public CartListResponse getCarts(Integer customerId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "cartId"));
        Page<Cart> cartPage = (status != null && !status.isEmpty()) ?
                cartRepository.findByCustomer_CustomerIdAndStatus(customerId, status, pageable) :
                cartRepository.findByCustomer_CustomerId(customerId, pageable);
        java.util.List<CartDTO> dtos = cartPage.getContent().stream().map(CartDTO::fromEntity).toList();
        return new CartListResponse(dtos, cartPage.getTotalElements(), cartPage.getTotalPages(), cartPage.getNumber());
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public CartDTO getCartDetail(Integer customerId, Integer cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
        if (!cart.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Cart does not belong to customer");
        }
        return CartDTO.fromEntity(cart);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public java.util.List<WishlistDTO> getWishlist(Integer customerId) {
        return wishlistRepository.findByCustomer_CustomerId(customerId).stream().map(WishlistDTO::fromEntity).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('customer.edit')")
    public void deleteWishlistItem(Integer customerId, Integer wishlistId) {
        var w = wishlistRepository.findById(wishlistId).orElseThrow(() -> new RuntimeException("Wishlist not found"));
        if (!w.getCustomer().getCustomerId().equals(customerId)) throw new RuntimeException("Wishlist not belong to customer");
        wishlistRepository.delete(w);
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public java.util.List<ConversationDTO> getConversations(Integer customerId) {
        return conversationRepository.findByCustomerId(customerId).stream().map(ConversationDTO::fromEntity).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('customer.view')")
    public ConversationDetailDTO getConversationDetail(Integer customerId, Integer convId) {
        var conv = conversationRepository.findById(convId).orElseThrow(() -> new RuntimeException("Conversation not found"));
        // Ensure customer participated
        boolean ok = conv.getChatMessages().stream().anyMatch(m -> ("customer".equals(m.getSenderType()) && m.getSenderId()!=null && m.getSenderId().equals(customerId)) || ("customer".equals(m.getReceiverType()) && m.getReceiverId()!=null && m.getReceiverId().equals(customerId)));
        if (!ok) throw new RuntimeException("Conversation not related to customer");
        java.util.List<ChatMessageDTO> msgs = conv.getChatMessages().stream()
                .sorted(java.util.Comparator.comparing(com.hyperformancelabs.backend.model.ChatMessage::getTimestamp))
                .map(ChatMessageDTO::fromEntity).toList();
        return new ConversationDetailDTO(conv.getConversationId(), conv.getStartTime(), conv.getEndTime(), conv.getStatus(), conv.getRating(), conv.getChannel(), msgs);
    }
}
