package com.hyperformancelabs.backend.service;

import org.springframework.mail.javamail.MimeMessagePreparator;

/**
 * Service để gửi email
 */
public interface EmailService {
    
    /**
     * Gửi email đơn giản
     * 
     * @param to Địa chỉ email người nhận
     * @param subject Tiêu đề email
     * @param text Nội dung email (có thể là HTML)
     */
    void sendSimpleEmail(String to, String subject, String text);
    
    /**
     * Gửi email với template HTML
     * 
     * @param to Địa chỉ email người nhận
     * @param subject Tiêu đề email
     * @param templateName Tên template HTML
     * @param variables Biến để binding vào template
     */
    void sendTemplateEmail(String to, String subject, String templateName, Object variables);
    
    /**
     * Gửi email tùy chỉnh
     * 
     * @param messagePreparator Đối tượng chuẩn bị email
     */
    void sendEmail(MimeMessagePreparator messagePreparator);
}
