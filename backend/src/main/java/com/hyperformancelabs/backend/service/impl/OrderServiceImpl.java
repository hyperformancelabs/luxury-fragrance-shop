package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.model.*;
import com.hyperformancelabs.backend.repository.*;
import com.hyperformancelabs.backend.service.OrderService;
import com.hyperformancelabs.backend.service.VnPayService;
import com.hyperformancelabs.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VnPayService vnPayService;
    private final ShipmentRepository shipmentRepository;
    private final PaymentRepository paymentRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Object createOrderFromCart(CreateOrderFromCartRequest request, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String username = jwtUtil.getUsernameFromToken(token);
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Cart cart = cartRepository.findByCustomerAndStatus(customer, "active")
                .orElseThrow(() -> new IllegalArgumentException("No active cart found"));

        List<CartItem> selectedItems = cartItemRepository.findByCartAndIsSelectedTrue(cart);
        if (selectedItems.isEmpty()) {
            throw new IllegalStateException("No selected items in the cart to place an order");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingOption("GHTK");
        order.setNote(request.getShippingNote());
        order.setShippingFee(request.getShippingCost());
        order.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : selectedItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProductVariant(cartItem.getProductVariant());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setNote(cartItem.getNote());
            order.addOrderItem(orderItem);

            totalAmount = totalAmount.add(
                    cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
        }

        order.setTotalAmount(totalAmount);

        if (request.getPaymentMethodId() == 4) {
            order.setOrderStatus("waitPayment");
        } else {
            order.setOrderStatus("cod");
        }

        orderRepository.save(order);

        if (request.getPaymentMethodId() == 4) {
            String vnpUrl = vnPayService.createVnPayPaymentURL(order, servletRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("url", vnpUrl);
            response.put("orderId", order.getOrderId());
            return response;
        }

        return order;
    }
    @Override
    @Transactional
    public Object createOrderFromAnonymous(CreateAnonymousOrderRequest request, HttpServletRequest servletRequest) {
        if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Không có sản phẩm nào trong đơn hàng");
        }

        if (customerRepository.existsByEmail(request.getEmail()) ||
                customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Email hoặc số điện thoại đã được sử dụng. Vui lòng đăng nhập.");
        }

        Customer customer = new Customer();
        customer.setUsername(request.getEmail());
        customer.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        customer.setName(request.getName());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setEmail(request.getEmail());
        customer.setStreet(request.getStreet());
        customer.setWard(request.getWard());
        customer.setDistrict(request.getDistrict());
        customer.setCity(request.getCity());
        customer.setShippingNote(request.getShippingNote());
        customer.setStatus("active");
        customer.setRating(10);
        customer.setLoyaltyPoints(0);
        customer.setCreateAt(LocalDateTime.now());

        customerRepository.save(customer);

        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(String.join(", ",
                request.getStreet(), request.getWard(), request.getDistrict(), request.getCity()));
        order.setShippingOption(request.getShippingOption());
        order.setShippingFee(request.getShippingFee());
        order.setOrderDate(LocalDateTime.now());
        order.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));
        order.setNote(request.getShippingNote());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest item : request.getOrderItems()) {
            ProductVariant variant = productVariantRepository.findById(item.getProductVariantId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm: " + item.getProductVariantId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProductVariant(variant);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getUnitPrice());
            orderItem.setNote(item.getNote());

            order.addOrderItem(orderItem);

            totalAmount = totalAmount.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        order.setTotalAmount(totalAmount);

        if (request.getPaymentMethodId() == 4) {
            order.setOrderStatus("waitPayment");
        } else {
            order.setOrderStatus("cod");
        }

        orderRepository.save(order);

        if (request.getPaymentMethodId() == 4) {
            String vnpUrl = vnPayService.createVnPayPaymentURL(order, servletRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("url", vnpUrl);
            response.put("orderId", order.getOrderId());
            return response;
        }

        return order;
    }


    @Override
    @Transactional
    public OrderDetailFullResponse getFullOrderDetail(Integer orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID = " + orderId));

            Customer customer = order.getCustomer();
            if (customer == null) {
                throw new RuntimeException("Đơn hàng không có thông tin khách hàng.");
            }

            // Lấy chi tiết sản phẩm
            List<OrderItemDetail> itemDetails = order.getOrderItems().stream().map(item -> {
                ProductVariant variant = item.getProductVariant();
                String productName = (variant != null && variant.getProduct() != null)
                        ? variant.getProduct().getProductName()
                        : "Không rõ sản phẩm";

                String volume = (variant != null)
                        ? variant.getVolume() + "ml"
                        : "N/A";

                return new OrderItemDetail(
                        productName,
                        volume,
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getNote()
                );
            }).toList();


            CustomerInfo customerInfo = new CustomerInfo(
                    customer.getName(),
                    customer.getPhoneNumber(),
                    customer.getEmail(),
                    order.getShippingAddress()
            );


            ShipmentInfo shipmentInfo = null;
            List<Shipment> shipments = shipmentRepository.findByOrder(order);
            if (!shipments.isEmpty()) {
                Shipment shipment = shipments.get(0);
                shipmentInfo = new ShipmentInfo(
                        shipment.getShippingProvider(),
                        shipment.getTrackingNumber(),
                        shipment.getShipmentStatus(),
                        shipment.getShippingDate(),
                        shipment.getDeliveryDate(),
                        shipment.getShippingCost()
                );
            }


            PaymentInfo paymentInfo = null;
            List<Payment> payments = paymentRepository.findByOrder(order);
            if (!payments.isEmpty()) {
                Payment payment = payments.get(0);
                String methodName = paymentMethodRepository.findById(payment.getPaymentMethodId())
                        .map(PaymentMethod::getMethodName)
                        .orElse("Không rõ");

                paymentInfo = new PaymentInfo(
                        methodName,
                        payment.getPaymentStatus(),
                        payment.getAmount(),
                        payment.getPaymentDate(),
                        payment.getTransactionId(),
                        payment.getCurrency()
                );
            }

            return new OrderDetailFullResponse(
                    order.getOrderId(),
                    order.getOrderStatus(),
                    order.getOrderDate(),
                    order.getEstimatedDeliveryDate(),
                    order.getShippingFee(),
                    order.getTotalAmount(),
                    customerInfo,
                    itemDetails,
                    shipmentInfo,
                    paymentInfo
            );

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết đơn hàng: " + e.toString(), e);
        }
    }


}
