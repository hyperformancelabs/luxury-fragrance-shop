package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.GetCartItemRequest;
import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.CartItem;
import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<GetCartItemRequest> getAllProductFromCart(Integer customerId){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));


        Cart cart = customer.getCarts().stream()
                .filter(c -> c.getStatus().equals("active"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Active cart not found"));

        // Map CartItems -> CartItemResponse
        return cart.getCartItems().stream().map(item -> {
            Product product = item.getProduct();
            return new GetCartItemRequest(
                    item.getCartItemId(),
                    product.getProductId(),
                    product.getProductName(),
                    product.getImageUrl(),
                    item.getUnitPrice(),
                    item.getQuantity(),
                    item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
            );
        }).toList();
    }
}
