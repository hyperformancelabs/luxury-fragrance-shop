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
    public static final String PRODUCT_VARIANT_NOT_FOUND = "Product variant not found";
    public static final String WISHLIST_ITEM_NOT_FOUND = "Wishlist item not found";
    public static final String INSUFFICIENT_STOCK = "Số lượng tồn kho không đủ cho sản phẩm: ";
    public static final String CART_NOT_FOUND = "Cart not found";
    public static final String CART_ITEM_NOT_FOUND = "Cart item not found";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String UNAUTHORIZED_CANCEL = "Bạn không có quyền huỷ đơn hàng này";
    public static final String INVALID_ORDER_STATUS = "Đơn hàng không thể huỷ trong trạng thái hiện tại";
    public static final String USERNAME_EXISTS = "Username đã tồn tại";
    public static final String EMAIL_EXISTS = "Email đã tồn tại";
    public static final String PHONE_EXISTS = "Số điện thoại đã tồn tại";
    public static final String USERNAME_NOT_FOUND = "Tên đăng nhập không tồn tại";
    public static final String PASSWORD_INCORRECT = "Mật khẩu không chính xác";
    public static final String OLD_PASSWORD_INCORRECT = "Mật khẩu cũ không chính xác";
}
