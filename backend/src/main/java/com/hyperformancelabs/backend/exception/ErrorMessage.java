package com.hyperformancelabs.backend.exception;

public class ErrorMessage {
    public static final String CUSTOMER_NOT_FOUND = "Customer not found";
    public static final String NO_ACTIVE_CART = "No active cart found";
    public static final String NO_SELECTED_ITEMS = "No selected items in the cart to place an order";
    public static final String PRODUCT_NOT_FOUND = "Không tìm thấy sản phẩm: ";
    public static final String ORDER_NOT_FOUND = "Không tìm thấy đơn hàng với ID = ";
    public static final String CUSTOMER_INFO_MISSING = "Đơn hàng không có thông tin khách hàng.";
    public static final String EMAIL_PHONE_IN_USE = "Email hoặc số điện thoại đã được sử dụng. Vui lòng đăng nhập.";
    public static final String EMPTY_ORDER = "Không có sản phẩm nào trong đơn hàng";
    public static final String ORDER_DETAIL_ERROR = "Lỗi khi lấy chi tiết đơn hàng: ";
}
