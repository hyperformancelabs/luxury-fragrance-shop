package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.CustomerDTO;
import com.hyperformancelabs.backend.service.CustomerService;
import com.hyperformancelabs.backend.service.impl.CustomUserDetailsService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/precheck")
    public String precheck(@RequestParam String phoneOrEmail,
                           @RequestParam String password,
                           RedirectAttributes redirectAttributes,
                           HttpServletRequest request) {

        CustomerDTO customer = customerService.getCustomerByEmailOrPhone(phoneOrEmail, phoneOrEmail);

        if (customer == null) {
            redirectAttributes.addFlashAttribute("error", "Tài khoản không tồn tại.");
            return "redirect:/auth/login";
        }

        if ("automatically created".equalsIgnoreCase(customer.getNote())) {
            redirectAttributes.addFlashAttribute("info", "Tài khoản được tạo tự động. Vui lòng đặt lại mật khẩu.");
            redirectAttributes.addFlashAttribute("phoneOrEmail", phoneOrEmail);
            return "redirect:/auth/reset-password";
        }

        if (passwordEncoder.matches(password, customer.getPassword())) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(
                    customer.getEmail() != null ? customer.getEmail() : customer.getPhoneNumber()
            );

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

            request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            return "redirect:/";
        }

        redirectAttributes.addFlashAttribute("error", "Mật khẩu không đúng.");
        return "redirect:/auth/login";
    }

    @PostMapping("/update-password")
    public String updatePassword(@RequestParam String phoneOrEmail,
                                 @RequestParam String newPassword,
                                 RedirectAttributes redirectAttributes) {

        CustomerDTO customer = customerService.getCustomerByEmailOrPhone(phoneOrEmail, phoneOrEmail);
        if (customer == null) {
            redirectAttributes.addFlashAttribute("error", "Không tìm thấy tài khoản.");
            return "redirect:/auth/reset-password";
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customer.setNote(null);
        customerService.updateCustomer(customer);

        redirectAttributes.addFlashAttribute("success", "Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại.");
        return "redirect:/auth/login";
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String register() {
        return "auth/register";
    }

    @GetMapping("/reset-password")
    public String resetPassword() {
        return "auth/reset-password";
    }
}
