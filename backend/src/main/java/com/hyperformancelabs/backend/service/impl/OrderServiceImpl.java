package com.hyperformancelabs.backend.service.impl;


import com.hyperformancelabs.backend.dto.*;
import com.hyperformancelabs.backend.exception.BadRequestException;
import com.hyperformancelabs.backend.exception.NotFoundException;
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
import java.time.ZoneOffset;
import java.util.*;

import static com.hyperformancelabs.backend.exception.ErrorMessage.*;

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
                .orElseThrow(() -> new NotFoundException(CUSTOMER_NOT_FOUND));

        Cart cart = cartRepository.findByCustomerAndStatus(customer, "active")
                .orElseThrow(() -> new NotFoundException(NO_ACTIVE_CART));

        List<CartItem> selectedItems = cartItemRepository.findByCartAndIsSelectedTrue(cart);
        if (selectedItems.isEmpty()) {
            throw new BadRequestException(NO_SELECTED_ITEMS);
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
        order.setOrderStatus(request.getPaymentMethodId() == 4 ? "pending" : "processing");

        orderRepository.save(order);

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setShippingProvider(order.getShippingOption());
        shipment.setShipmentStatus("pending");
        shipment.setShippingCost(order.getShippingFee());
        shipment.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        shipmentRepository.save(shipment);

        if (request.getPaymentMethodId() != 4) {
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethodId(request.getPaymentMethodId());
//            payment.setPaymentDate(LocalDateTime.now());
//            payment.setPaymentDate(LocalDateTime.now(ZoneOffset.UTC).minusSeconds(10));
            payment.setPaymentStatus("pending"); // hoặc "cod_pending"
            payment.setCurrency("VND");
            paymentRepository.save(payment);
        }


        cartItemRepository.deleteAll(selectedItems);


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
            throw new BadRequestException(EMPTY_ORDER);
        }

        if (customerRepository.existsByEmail(request.getEmail()) ||
                customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException(EMAIL_PHONE_IN_USE);
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
                    .orElseThrow(() -> new NotFoundException(PRODUCT_NOT_FOUND + item.getProductVariantId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProductVariant(variant);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getUnitPrice());
            orderItem.setNote(item.getNote());

            order.addOrderItem(orderItem);

            totalAmount = totalAmount.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        order.setTotalAmount(totalAmount);
        order.setOrderStatus(request.getPaymentMethodId() == 4 ? "pending" : "processing");

        orderRepository.save(order);

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setShippingProvider(order.getShippingOption());
        shipment.setShipmentStatus("pending");
        shipment.setShippingCost(order.getShippingFee());
        shipment.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        shipmentRepository.save(shipment);

        if (request.getPaymentMethodId() != 4) {
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethodId(request.getPaymentMethodId());
//            payment.setPaymentDate(LocalDateTime.now().minusMinutes(1));
            payment.setPaymentStatus("pending");
            payment.setCurrency("VND");
            paymentRepository.save(payment);
        }



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
                    .orElseThrow(() -> new NotFoundException(ORDER_NOT_FOUND + orderId));

            Customer customer = order.getCustomer();
            if (customer == null) {
                throw new NotFoundException(CUSTOMER_INFO_MISSING);
            }

            List<OrderItemDetail> itemDetails = order.getOrderItems().stream().map(item -> {
                ProductVariant variant = item.getProductVariant();
                String imageUrl = (variant != null && variant.getProduct() != null)
                        ? variant.getProduct().getImageUrl()
                        : null;

                String productName = (variant != null && variant.getProduct() != null)
                        ? variant.getProduct().getProductName()
                        : "Không rõ sản phẩm";

                String volume = (variant != null)
                        ? variant.getVolume() + "ml"
                        : "N/A";

                return new OrderItemDetail(productName, volume, item.getQuantity(), item.getUnitPrice(),imageUrl, item.getNote());
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
            throw new RuntimeException(ORDER_DETAIL_ERROR + e.getMessage(), e);
        }
    }

    @Override
    public List<OrderDetailFullResponse> getAllOrdersOfCustomer(String token) {
        String username = jwtUtil.getUsernameFromToken(token);

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Customer không tồn tại"));

        List<Order> orders = orderRepository.findByCustomerOrderByOrderDateDesc(customer);

        return orders.stream().map(order -> {
            // Lấy chi tiết sản phẩm
            List<OrderItemDetail> itemDetails = order.getOrderItems().stream().map(item -> {
                ProductVariant variant = item.getProductVariant();
                Product product = variant.getProduct();
                return new OrderItemDetail(
                        product.getProductName(),
                        variant.getVolume() + "ml",
                        item.getQuantity(),
                        item.getUnitPrice(),
                        product.getImageUrl(),
                        item.getNote()
                );
            }).toList();

            // Xử lý Shipment
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

            // Xử lý Payment
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

            // Trả về OrderDetailFullResponse
            return new OrderDetailFullResponse(
                    order.getOrderId(),
                    order.getOrderStatus(),
                    order.getOrderDate(),
                    order.getEstimatedDeliveryDate(),
                    order.getShippingFee(),
                    order.getTotalAmount(),
                    new CustomerInfo(
                            customer.getName(),
                            customer.getPhoneNumber(),
                            customer.getEmail(),
                            order.getShippingAddress()
                    ),
                    itemDetails,
                    shipmentInfo,
                    paymentInfo
            );
        }).toList();
    }


}
