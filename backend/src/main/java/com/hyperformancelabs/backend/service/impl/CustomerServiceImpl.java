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
        if (customerRepository.existsByEmail(request.getEmail())) {
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
        customer.setEmail(request.getEmail());
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
        return jwtUtil.generateToken(customer.getCustomerId(), customer.getUsername());
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
}
