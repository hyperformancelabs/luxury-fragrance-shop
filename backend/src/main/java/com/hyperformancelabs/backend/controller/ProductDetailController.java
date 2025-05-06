package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/product-details")
//@RequiredArgsConstructor
public class ProductDetailController {

    @Autowired
    public ProductDetailService productDetailService;

    @GetMapping("/tone-scents")
    public ResponseEntity<List<String>> getAllToneScents() {
        List<String> toneScents = productDetailService.getAllToneScents();
        return ResponseEntity.ok(toneScents);
    }

    @GetMapping("/styles")
    public ResponseEntity<List<String>> getAllStyles() {
        List<String> styles = productDetailService.getAllStyles();
        return ResponseEntity.ok(styles);
    }
}
