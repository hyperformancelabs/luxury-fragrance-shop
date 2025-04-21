package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a customer in the system.
 * Contains personal details and shopping history information.
 */
@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "username", length = 50, unique = true)
    private String username;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "name", length = 100, nullable = false)
    @NotBlank(message = "Name is required")
    private String name;

    @Column(name = "phone_number", length = 20, unique = true)
    @Pattern(regexp = "^[0-9 ()+-]+$", message = "Invalid phone number format")
    private String phoneNumber;

    @Column(name = "email", length = 100, unique = true)
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "street", length = 255)
    private String street;

    @Column(name = "ward", length = 50)
    private String ward;

    @Column(name = "district", length = 50)
    private String district;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "shipping_note", length = 50)
    private String shippingNote;

    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "rating", nullable = false)
    @Min(value = 0, message = "Rating must be non-negative")
    private Integer rating = 10;

    @Column(name = "status", length = 20, nullable = false)
    @Pattern(regexp = "^(active|inactive|banned)$", message = "Status must be active, inactive, or banned")
    private String status = "active";

    @Column(name = "loyalty_points", nullable = false)
    @Min(value = 0, message = "Loyalty points must be non-negative")
    private Integer loyaltyPoints = 0;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt = LocalDateTime.now();

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "customer")
    private Set<Cart> carts = new HashSet<>();

//    @OneToMany(mappedBy = "customer")
//    private Set<CustomerPaymentMethod> paymentMethods = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    private Set<Order> orders = new HashSet<>();

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getShippingNote() {
        return shippingNote;
    }

    public void setShippingNote(String shippingNote) {
        this.shippingNote = shippingNote;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(Integer loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }

    public Set<Cart> getCarts() {
        return carts;
    }

    public void setCarts(Set<Cart> carts) {
        this.carts = carts;
    }

//    public Set<CustomerPaymentMethod> getPaymentMethods() {
//        return paymentMethods;
//    }
//
//    public void setPaymentMethods(Set<CustomerPaymentMethod> paymentMethods) {
//        this.paymentMethods = paymentMethods;
//    }

    public Set<Order> getOrders() {
        return orders;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }
}
