package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.config.VnPayConfig;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.model.Payment;
import com.hyperformancelabs.backend.model.PaymentMethod;
import com.hyperformancelabs.backend.payload.ApiResponse;
import com.hyperformancelabs.backend.payload.ApiResponseStatus;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.repository.PaymentMethodRepository;
import com.hyperformancelabs.backend.repository.PaymentRepository;
import com.hyperformancelabs.backend.service.impl.VnPayServiceImpl;
import com.hyperformancelabs.backend.util.VnPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/payment")
public class VnPayController {

    @Autowired
    private VnPayConfig vnPayConfig;


    @Autowired
    private VnPayServiceImpl vnPayService;


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @GetMapping("/vnpay")
    public String createPaymentUrl(@RequestParam Integer orderId, HttpServletRequest request) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return vnPayService.createVnPayPaymentURL(order, request);
    }

    @GetMapping("/vnpay-return")
    public RedirectView vnPayReturn(@RequestParam Map<String, String> params) {
        try {
            // Validate hash
            String secureHash = Optional.ofNullable(params.get("vnp_SecureHash"))
                    .orElse("")
                    .replace(" ", "+");

            Map<String, String> inputData = new HashMap<>(params);
            inputData.remove("vnp_SecureHash");
            inputData.remove("vnp_SecureHashType");
            inputData.remove("vnp_ReturnUrl");

            String rawData = VnPayUtil.buildQuery(inputData, true);
            String computedHash = VnPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), rawData);

            if (!computedHash.equals(secureHash)) {
                return new RedirectView("http://localhost:5173/payment-failed?reason=invalid-signature");
            }

            String vnpTxnRef = params.get("vnp_TxnRef");
            String vnpAmount = params.get("vnp_Amount");
            String vnpOrderInfo = params.get("vnp_OrderInfo");
            String vnpResponseCode = params.get("vnp_ResponseCode");
            String vnpTransactionNo = params.get("vnp_TransactionNo");

            Integer orderId = Integer.parseInt(vnpOrderInfo.split(":")[1]);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setPaymentDate(LocalDateTime.now(ZoneOffset.UTC).minusSeconds(10));
            payment.setAmount(new BigDecimal(vnpAmount).divide(new BigDecimal("100")));
            payment.setTransactionId(vnpTransactionNo);
            payment.setCurrency("VND");
            payment.setPaymentMethodId(4);

            if ("00".equals(vnpResponseCode)) {
                payment.setPaymentStatus("completed");
                order.setOrderStatus("processing");
                orderRepository.save(order);
            } else {
                payment.setPaymentStatus("failed");
            }

            payment.setNote("VnPay Transaction Reference: " + vnpTxnRef);
            paymentRepository.save(payment);

            String frontendRedirect = "http://localhost:5173/payment-result?orderId=" + orderId + "&status=" + payment.getPaymentStatus();
            return new RedirectView(frontendRedirect);

        } catch (Exception e) {
            return new RedirectView("http://localhost:5173/payment-failed?reason=" + e.getMessage());
        }
    }




}
