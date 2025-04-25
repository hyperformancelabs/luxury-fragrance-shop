package com.hyperformancelabs.backend.service.impl;


import com.hyperformancelabs.backend.dto.CreateOrderRequest;
import com.hyperformancelabs.backend.dto.OrderDetailDTO;
import com.hyperformancelabs.backend.dto.OrderItemDTO;
import com.hyperformancelabs.backend.dto.OrderSummary;
import com.hyperformancelabs.backend.model.*;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public void checkout(String username, CreateOrderRequest request) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findTopByCustomerAndStatusOrderByCartIdDesc(customer, "active")
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDate.now().atStartOfDay());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingOption(request.getShippingOption());
        order.setNote(request.getNote());
        order.setOrderStatus("pending");
        order.setShippingFee(BigDecimal.ZERO);
        order.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getUnitPrice());

            order.addOrderItem(orderItem);
            total = total.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        order.setTotalAmount(total);
        orderRepository.save(order);

//        cart.setStatus("ordered");
        cartRepository.save(cart);
    }



    @Override
    public List<OrderSummary> getOrdersForCustomer(String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByCustomer(customer);

        return orders.stream()
                .map(o -> new OrderSummary(
                        o.getOrderId(),
                        o.getOrderDate(),
                        o.getTotalAmount(),
                        o.getOrderStatus(),
                        o.getShippingOption()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public OrderDetailDTO getOrderDetail(Integer orderId, String username) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new RuntimeException("Access denied");
        }

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item ->
                new OrderItemDTO(
                        item.getProduct().getProductName(),
                        item.getProduct().getVolume(),
                        item.getProduct().getBrand().getBrandName(),
                        item.getQuantity(),
                        item.getUnitPrice()
                )
        ).toList();
        System.out.println("Order items count: " + order.getOrderItems().size());
        order.getOrderItems().forEach(i -> System.out.println("Item: " + i.getProduct().getProductName()));

        return new OrderDetailDTO(
                order.getOrderId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getShippingAddress(),
                order.getShippingOption(),
                itemDTOs
        );

    }



}

