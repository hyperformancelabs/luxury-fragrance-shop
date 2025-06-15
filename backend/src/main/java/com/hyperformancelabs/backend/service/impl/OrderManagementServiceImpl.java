package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.dto.OrderDTO;
import com.hyperformancelabs.backend.dto.OrderListResponse;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.model.OrderItem;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.model.Shipment;
import com.hyperformancelabs.backend.model.Payment;
import com.hyperformancelabs.backend.model.OrderPromotion;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.service.OrderManagementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderManagementServiceImpl implements OrderManagementService {

    private static final Logger logger = LoggerFactory.getLogger(OrderManagementServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.CustomerRepository customerRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.ProductVariantRepository productVariantRepository;

    @Autowired(required = false)
    private com.hyperformancelabs.backend.repository.EmployeeRepository employeeRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.OrderItemRepository orderItemRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.ShipmentRepository shipmentRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.PaymentRepository paymentRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.PromotionRepository promotionRepository;

    @Autowired
    private com.hyperformancelabs.backend.repository.OrderPromotionRepository orderPromotionRepository;

    @Override
    @PreAuthorize("hasAuthority('order.view')")
    @Transactional(readOnly = true)
    public OrderListResponse getAllOrders(int page, int size, String sortBy, Sort.Direction sortDirection, Map<String, String> filters) {
        try {
            logger.info("Getting orders page={}, size={}, sortBy={}, sortDirection={}, filters={}", page, size, sortBy, sortDirection, filters);

            Sort sort = Sort.by(sortDirection, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);

            Specification<Order> spec = buildSpecification(filters);

            Page<Order> orderPage = orderRepository.findAll(spec, pageable);

            List<OrderDTO> orderDTOs = orderPage.getContent()
                    .stream()
                    .map(OrderDTO::toDTO)
                    .collect(Collectors.toList());

            return new OrderListResponse(orderDTOs, orderPage.getTotalElements(), orderPage.getTotalPages(), orderPage.getNumber());
        } catch (Exception e) {
            logger.error("Error getting orders", e);
            throw e;
        }
    }

    private Specification<Order> buildSpecification(Map<String, String> filters) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            // status filter
            String status = filters.get("status");
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("orderStatus")), status.toLowerCase()));
            }

            // customerId filter
            String customerIdStr = filters.get("customerId");
            if (customerIdStr != null) {
                try {
                    Integer customerId = Integer.parseInt(customerIdStr);
                    predicates.add(cb.equal(root.get("customer").get("customerId"), customerId));
                } catch (NumberFormatException ignored) {
                }
            }

            // date range
            String dateFrom = filters.get("dateFrom");
            if (dateFrom != null && !dateFrom.isEmpty()) {
                LocalDateTime start = LocalDate.parse(dateFrom, DATE_FORMATTER).atStartOfDay();
                predicates.add(cb.greaterThanOrEqualTo(root.get("orderDate"), start));
            }
            String dateTo = filters.get("dateTo");
            if (dateTo != null && !dateTo.isEmpty()) {
                LocalDateTime end = LocalDate.parse(dateTo, DATE_FORMATTER).atTime(23, 59, 59);
                predicates.add(cb.lessThanOrEqualTo(root.get("orderDate"), end));
            }

            // keyword search (orderId, shippingAddress, note, customer name)
            String keyword = filters.get("keyword");
            if (keyword != null && !keyword.isEmpty()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                jakarta.persistence.criteria.Predicate p1 = cb.like(cb.lower(root.get("shippingAddress")), pattern);
                jakarta.persistence.criteria.Predicate p2 = cb.like(cb.lower(root.get("note")), pattern);
                jakarta.persistence.criteria.Predicate p3 = cb.like(root.get("orderId").as(String.class), pattern);
                // join customer
                var customerJoin = root.join("customer", jakarta.persistence.criteria.JoinType.LEFT);
                jakarta.persistence.criteria.Predicate p4 = cb.like(cb.lower(customerJoin.get("name")), pattern);

                predicates.add(cb.or(p1, p2, p3, p4));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    /* --------------------- NEW FEATURES ------------------- */

    @Override
    @PreAuthorize("hasAuthority('order.view')")
    @Transactional(readOnly = true)
    public com.hyperformancelabs.backend.dto.OrderDetailDTO getOrderDetail(Integer orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        java.util.List<com.hyperformancelabs.backend.model.OrderItem> itemsCopy = new java.util.ArrayList<>(order.getOrderItems());
        java.util.List<com.hyperformancelabs.backend.dto.OrderItemDTO> itemDTOs = itemsCopy.stream().map(item ->
                new com.hyperformancelabs.backend.dto.OrderItemDTO(
                        item.getProductVariant().getProduct().getProductName(),
                        item.getProductVariant().getVolume(),
                        item.getProductVariant().getProduct().getBrand().getBrandName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getOrderItemId(),
                        item.getProductVariant().getProductVariantId()
                )
        ).toList();

        com.hyperformancelabs.backend.dto.ShipmentDTO shipmentDTO = null;
        com.hyperformancelabs.backend.dto.PaymentDTO paymentDTO = null;

        java.util.List<com.hyperformancelabs.backend.dto.PromotionDTO> promotionDTOs = java.util.Collections.emptyList();

        if (logger.isDebugEnabled()) {
            logger.debug("Order {} found: items={}", order.getOrderId(), order.getOrderItems().size());
        }

        return new com.hyperformancelabs.backend.dto.OrderDetailDTO(
                order.getOrderId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getShippingAddress(),
                order.getShippingOption(),
                itemDTOs,
                shipmentDTO,
                paymentDTO,
                promotionDTOs
        );
    }

    @Override
    @PreAuthorize("hasAuthority('order.create')")
    @Transactional
    public Integer createOrder(com.hyperformancelabs.backend.dto.AdminCreateOrderRequest request, String employeeUsername) {
        com.hyperformancelabs.backend.model.Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Order order = new Order();
        order.setCustomer(customer);
        if (employeeUsername != null) {
            if (employeeRepository != null) {
                employeeRepository.findByUsername(employeeUsername).ifPresent(order::setEmployee);
            }
        }

        order.setOrderDate(java.time.LocalDateTime.now());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingOption(request.getShippingOption());
        order.setNote(request.getNote());
        order.setOrderStatus("pending");
        order.setShippingFee(request.getShippingFee() != null ? request.getShippingFee() : java.math.BigDecimal.ZERO);
        order.setEstimatedDeliveryDate(java.time.LocalDate.now().plusDays(3));

        java.math.BigDecimal total = java.math.BigDecimal.ZERO;

        for (com.hyperformancelabs.backend.dto.OrderItemRequest itemReq : request.getItems()) {
            com.hyperformancelabs.backend.model.ProductVariant variant = productVariantRepository.findById(itemReq.getProductVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found: " + itemReq.getProductVariantId()));

            com.hyperformancelabs.backend.model.OrderItem orderItem = new com.hyperformancelabs.backend.model.OrderItem();
            orderItem.setProductVariant(variant);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(itemReq.getUnitPrice());

            order.addOrderItem(orderItem);

            total = total.add(itemReq.getUnitPrice().multiply(java.math.BigDecimal.valueOf(itemReq.getQuantity())));
        }

        order.setTotalAmount(total.add(order.getShippingFee()));

        Order saved = orderRepository.save(order);
        return saved.getOrderId();
    }

    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void updateOrderGeneralInfo(Integer orderId, com.hyperformancelabs.backend.dto.UpdateOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setShippingAddress(request.getShippingAddress());
        order.setShippingOption(request.getShippingOption());
        order.setNote(request.getNote());
        if (request.getShippingFee() != null) {
            order.setShippingFee(request.getShippingFee());
        }

        orderRepository.save(order);
    }

    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void updateOrderStatus(Integer orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Prevent status change when order is already cancelled unless setting again to cancelled
        if ("cancelled".equalsIgnoreCase(order.getOrderStatus()) &&
                !"cancelled".equalsIgnoreCase(status)) {
            throw new RuntimeException("Order already cancelled");
        }

        // Normalize & validate new status
        String normalized = status == null ? "" : status.toLowerCase();
        java.util.Set<String> allowed = java.util.Set.of("pending", "processing", "shipping", "delivered", "cancelled");
        if (!allowed.contains(normalized)) {
            throw new RuntimeException("Invalid status value: " + status);
        }

        // Direct DB update to bypass Bean Validation constraints on unchanged fields (e.g., estimatedDeliveryDate)
        orderRepository.updateOrderStatus(orderId, normalized);
    }

    @Override
    @PreAuthorize("hasAuthority('order.delete')")
    @Transactional
    public void cancelOrder(Integer orderId, String reason) {
        Order order = orderRepository.findByIdWithItems(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if ("cancelled".equalsIgnoreCase(order.getOrderStatus())) {
            return; // already cancelled
        }
        // Only allow cancel if not delivered
        if ("delivered".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Cannot cancel delivered order");
        }

        // Restore inventory
        for (var item : order.getOrderItems()) {
            var variant = item.getProductVariant();
            variant.setQuantityInStock(variant.getQuantityInStock() + item.getQuantity());
            productVariantRepository.save(variant);
        }

        order.setOrderStatus("cancelled");
        if (reason != null) {
            order.setNote((order.getNote() != null ? order.getNote() + " | " : "") + "Cancelled: " + reason);
        }
        orderRepository.save(order);
    }

    @Override
    @PreAuthorize("hasAuthority('paymentmethod.view')")
    @Transactional(readOnly = true)
    public java.util.List<com.hyperformancelabs.backend.dto.PaymentMethodDTO> getPaymentMethods() {
        return paymentMethodRepository.findAll().stream().map(com.hyperformancelabs.backend.dto.PaymentMethodDTO::fromEntity).collect(java.util.stream.Collectors.toList());
    }

    private static final java.util.List<String> SHIPPING_PROVIDERS = java.util.List.of("GHTK", "Ahamove", "GrabExpress", "VNPost");

    @Override
    @Transactional(readOnly = true)
    public java.util.List<String> getShippingProviders() {
        return SHIPPING_PROVIDERS;
    }

    /* ------------ Item operations -------------- */
    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public Integer addOrderItem(Integer orderId, com.hyperformancelabs.backend.dto.OrderItemRequest request) {
        Order order = orderRepository.findByIdWithItems(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId()).orElseThrow(() -> new RuntimeException("Variant not found"));
        if (variant.getQuantityInStock() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        OrderItem item = new OrderItem();
        item.setProductVariant(variant);
        item.setQuantity(request.getQuantity());
        item.setUnitPrice(request.getUnitPrice());
        order.addOrderItem(item);

        variant.setQuantityInStock(variant.getQuantityInStock() - request.getQuantity());
        productVariantRepository.save(variant);

        recalcOrderTotal(order);
        orderRepository.save(order);
        return item.getOrderItemId();
    }

    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void updateOrderItemQuantity(Integer orderId, Integer orderItemId, Integer quantity) {
        OrderItem item = orderItemRepository.findById(orderItemId).orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getOrder().getOrderId().equals(orderId)) {
            throw new RuntimeException("Item not in order");
        }
        ProductVariant variant = item.getProductVariant();
        int delta = quantity - item.getQuantity();
        if (delta > 0 && variant.getQuantityInStock() < delta) {
            throw new RuntimeException("Not enough stock");
        }
        // adjust stock
        variant.setQuantityInStock(variant.getQuantityInStock() - delta);
        productVariantRepository.save(variant);

        item.setQuantity(quantity);
        orderItemRepository.save(item);

        recalcOrderTotal(item.getOrder());
    }

    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void deleteOrderItem(Integer orderId, Integer orderItemId) {
        OrderItem item = orderItemRepository.findById(orderItemId).orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getOrder().getOrderId().equals(orderId)) {
            throw new RuntimeException("Item not in order");
        }
        ProductVariant variant = item.getProductVariant();
        variant.setQuantityInStock(variant.getQuantityInStock() + item.getQuantity());
        productVariantRepository.save(variant);

        Order order = item.getOrder();
        order.getOrderItems().remove(item);
        orderItemRepository.delete(item);

        recalcOrderTotal(order);
        orderRepository.save(order);
    }

    private void recalcOrderTotal(Order order) {
        java.math.BigDecimal sum = java.math.BigDecimal.ZERO;
        for (OrderItem oi : order.getOrderItems()) {
            sum = sum.add(oi.getUnitPrice().multiply(java.math.BigDecimal.valueOf(oi.getQuantity())));
        }
        order.setTotalAmount(sum.add(order.getShippingFee() != null ? order.getShippingFee() : java.math.BigDecimal.ZERO));
    }

    /* ------------ Shipment & Payment -------------- */
    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void updateShipment(Integer orderId, com.hyperformancelabs.backend.dto.UpdateShipmentRequest request) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Shipment shipment = order.getShipments().stream().findFirst().orElse(new Shipment());
        shipment.setOrder(order);
        shipment.setShippingProvider(request.getShippingProvider());
        shipment.setTrackingNumber(request.getTrackingNumber());
        shipment.setShipmentStatus(request.getShipmentStatus());
        shipment.setShippingCost(request.getShippingCost());
        shipment.setShippingDate(request.getShippingDate());
        shipment.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
        shipment.setDeliveryDate(request.getDeliveryDate());
        shipmentRepository.save(shipment);
        order.getShipments().add(shipment);
        orderRepository.save(order);
    }

    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void updatePayment(Integer orderId, com.hyperformancelabs.backend.dto.UpdatePaymentRequest request) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Payment payment = order.getPayments().stream().findFirst().orElse(new Payment());
        payment.setOrder(order);
        payment.setAmount(request.getAmount());
        payment.setPaymentStatus(request.getPaymentStatus());
        payment.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : java.time.LocalDateTime.now());
        payment.setTransactionId(request.getTransactionId());
        payment.setNote(request.getNote());
        payment.setCurrency(request.getCurrency() != null ? request.getCurrency() : "VND");
        paymentRepository.save(payment);
        order.getPayments().add(payment);
        orderRepository.save(order);
    }

    /* ------------ Promotions -------------- */
    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void applyPromotion(Integer orderId, Integer promotionId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getOrderPromotions().stream().anyMatch(op -> op.getPromotion().getPromotionId().equals(promotionId)))
            return;
        var promo = promotionRepository.findById(promotionId).orElseThrow(() -> new RuntimeException("Promotion not found"));
        OrderPromotion op = new OrderPromotion();
        op.setOrder(order);
        op.setPromotion(promo);
        op.setDiscountAmount(java.math.BigDecimal.ZERO);
        orderPromotionRepository.save(op);
        order.getOrderPromotions().add(op);
    }

    @Override
    @PreAuthorize("hasAuthority('order.edit')")
    @Transactional
    public void removePromotion(Integer orderId, Integer promotionId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        OrderPromotion op = order.getOrderPromotions().stream().filter(p -> p.getPromotion().getPromotionId().equals(promotionId)).findFirst().orElseThrow(() -> new RuntimeException("Promotion not applied"));
        order.getOrderPromotions().remove(op);
        orderPromotionRepository.delete(op);
    }
} 