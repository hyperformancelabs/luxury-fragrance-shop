package com.hyperformancelabs.backend.service.impl;


import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.*;
import com.hyperformancelabs.backend.repository.CartItemRepository;
import com.hyperformancelabs.backend.repository.CartRepository;
import com.hyperformancelabs.backend.repository.CustomerRepository;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
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
    public void createOrder(String username, CreateOrderRequest request) {
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
            orderItem.setProductVariant(item.getProductVariant());
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
                        item.getProductVariant().getProduct().getProductName(),
                        item.getProductVariant().getVolume(),
                        item.getProductVariant().getProduct().getBrand().getBrandName(),
                        item.getQuantity(),
                        item.getUnitPrice()
                )
        ).toList();
        System.out.println("Order items count: " + order.getOrderItems().size());
        order.getOrderItems().forEach(i -> System.out.println("Item: " + i.getProductVariant().getProduct().getProductName()));

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

    @Override
    public Page<OrderDTO> getAllOrders(int page) {
        Pageable pageable = PageRequest.of(page, 25);
        Page<Order> orderPage = orderRepository.findAll(pageable);
        return orderPage.map(OrderDTO::toDTO);
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersToday() {
        return orderRepository.getTotalAmountOfDeliveredOrdersToday();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersInCurrentWeek() {
        return orderRepository.getTotalAmountOfDeliveredOrdersInCurrentWeek();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersInCurrentMonth() {
        return orderRepository.getTotalAmountOfDeliveredOrdersInCurrentMonth();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersInCurrentYear() {
        return orderRepository.getTotalAmountOfDeliveredOrdersInCurrentYear();
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersByMonthAndYear(int month, int year) {
        return orderRepository.getTotalAmountOfDeliveredOrdersByMonthAndYear(month, year);
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersByDateRange(String startDate, String endDate) {
        return orderRepository.getTotalAmountOfDeliveredOrdersByDateRange(startDate, endDate);
    }

    @Override
    public BigDecimal getTotalAmountOfDeliveredOrdersByQuarterAndYear(int quarter, int year) {
        return orderRepository.getTotalAmountOfDeliveredOrdersByQuarterAndYear(quarter, year);
    }

    @Override
    @Transactional
    public void UpdateOrderStatus(Integer orderId, String status) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(status);
        orderRepository.save(order);
    }
}

