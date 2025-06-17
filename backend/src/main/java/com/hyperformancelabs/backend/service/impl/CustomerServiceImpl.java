// --- CustomerServiceImpl.java ---
package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.CustomerProfile;
import com.hyperformancelabs.backend.dto.CustomerResponseDTO;
import com.hyperformancelabs.backend.dto.LoginRequest;
import com.hyperformancelabs.backend.dto.RegisterRequest;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.WishList;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.WishListRepository;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import static com.hyperformancelabs.backend.exception.ErrorMessage.*;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public CustomerResponseDTO register(RegisterRequest request) {
        if (customerRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException(USERNAME_EXISTS);
        }
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(EMAIL_EXISTS);
        }
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException(PHONE_EXISTS);
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

        WishList wishlist = new WishList();
        wishlist.setCustomer(savedCustomer);
//        wishlist.setAddedDate(LocalDateTime.now(ZoneOffset.UTC));
        wishListRepository.save(wishlist);

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
                .orElseThrow(() -> new RuntimeException(USERNAME_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException(PASSWORD_INCORRECT);
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
                .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND));
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
            throw new RuntimeException(OLD_PASSWORD_INCORRECT);
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customerRepository.save(customer);
    }
}
