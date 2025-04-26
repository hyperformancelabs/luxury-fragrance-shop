package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.config.VnPayConfig;
import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.repository.OrderRepository;
import com.hyperformancelabs.backend.repository.PaymentRepository;
import com.hyperformancelabs.backend.service.impl.VnPayServiceImpl;
import com.hyperformancelabs.backend.util.VnPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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

    @GetMapping("/vnpay")
    public String createPaymentUrl(@RequestParam Integer orderId, HttpServletRequest request) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return vnPayService.createVnPayPaymentURL(order, request);
    }

    @GetMapping("/vnpay-return")
    public String vnPayReturn(@RequestParam Map<String, String> params) {
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
            return "❌ Chữ ký không hợp lệ!";
        }

        // TODO: lưu vào DB
        return "✅ Thanh toán hợp lệ!";
    }


}
