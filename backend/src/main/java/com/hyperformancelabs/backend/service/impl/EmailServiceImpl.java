package com.hyperformancelabs.backend.service.impl;

import com.hyperformancelabs.backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    
    public EmailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }
    
    @Override
    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true); // true indicates HTML content
            
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    @Override
    @Async
    public void sendTemplateEmail(String to, String subject, String templateName, Object variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            Context context = new Context();
            if (variables instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> variablesMap = (java.util.Map<String, Object>) variables;
                context.setVariables(variablesMap);
            }
            
            String htmlContent = templateEngine.process(templateName, context);
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Template email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send template email to: {}", to, e);
            throw new RuntimeException("Failed to send template email", e);
        }
    }
    
    @Override
    @Async
    public void sendEmail(MimeMessagePreparator messagePreparator) {
        try {
            mailSender.send(messagePreparator);
            logger.info("Custom email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send custom email", e);
            throw new RuntimeException("Failed to send custom email", e);
        }
    }
}
