document.addEventListener('DOMContentLoaded', function() {
    // Xử lý chọn phương thức thanh toán
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Tìm radio button trong phương thức thanh toán này
            const radio = this.querySelector('input[type="radio"]');
            
            // Chọn radio button
            radio.checked = true;
            
            // Cập nhật trạng thái active
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Xử lý form thanh toán
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Kiểm tra form hợp lệ
            if (!checkoutForm.checkValidity()) {
                e.stopPropagation();
                checkoutForm.classList.add('was-validated');
                return;
            }
            
            // Hiển thị thông báo đang xử lý
            const submitBtn = document.getElementById('place-order-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';
            
            // Giả lập xử lý đơn hàng
            setTimeout(() => {
                // Chuyển hướng đến trang xác nhận đơn hàng
                window.location.href = '/checkout/confirmation';
            }, 2000);
        });
    }
    
    // Xử lý chọn địa chỉ giao hàng giống địa chỉ thanh toán
    const sameAddressCheckbox = document.getElementById('sameAddress');
    const shippingAddressSection = document.getElementById('shipping-address-section');
    
    if (sameAddressCheckbox && shippingAddressSection) {
        sameAddressCheckbox.addEventListener('change', function() {
            if (this.checked) {
                shippingAddressSection.style.display = 'none';
            } else {
                shippingAddressSection.style.display = 'block';
            }
        });
        
        // Khởi tạo ban đầu
        if (sameAddressCheckbox.checked) {
            shippingAddressSection.style.display = 'none';
        }
    }
    
    // Xử lý chọn tỉnh/thành phố
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    
    if (provinceSelect && districtSelect) {
        provinceSelect.addEventListener('change', function() {
            // Trong thực tế, bạn sẽ gọi API để lấy danh sách quận/huyện tương ứng
            // Ở đây, chúng ta sẽ giả lập
            
            // Xóa các option cũ
            districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
            
            // Thêm các option mới dựa trên tỉnh/thành phố đã chọn
            if (this.value === 'hanoi') {
                addDistrictOptions(['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy']);
            } else if (this.value === 'hcm') {
                addDistrictOptions(['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5']);
            } else if (this.value === 'danang') {
                addDistrictOptions(['Hải Châu', 'Thanh Khê', 'Liên Chiểu', 'Ngũ Hành Sơn', 'Sơn Trà']);
            }
            
            // Kích hoạt select
            districtSelect.disabled = false;
        });
        
        function addDistrictOptions(districts) {
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase().replace(/\s+/g, '');
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    }
});
