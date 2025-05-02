// --- CustomerServiceImpl.java ---
package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.CustomerProfile;
import com.hyperformancelabs.backend.dto.CustomerResponseDTO;
import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
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
        return jwtUtil.generateToken(customer.getUsername());
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
}
