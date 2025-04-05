import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer Support Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
            <ul className="space-y-2">
              <li>Chính sách bảo mật thông tin</li>
              <li>Chính sách thành viên</li>
              <li>Chính sách bảo hành & đổi trả</li>
              <li>Chính sách giao nhận & vận chuyển</li>
              <li>Hướng dẫn mua hàng & thanh toán</li>
            </ul>
          </div>

          {/* About APH Perfume Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">VỀ APH PERFUME</h3>
            <ul className="space-y-2">
              <li>Giới thiệu APH Perfume</li>
              <li>CEO Vũ Hoàng Phát</li>
              <li>Điều khoản dịch vụ</li>
              <li>Tuyển dụng</li>
              <li>Liên hệ</li>
            </ul>
          </div>

          {/* Social Media and Payment Column */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">THEO DÕI CHÚNG TÔI TẠI</h3>
              <div className="flex space-x-2">
                <a href="#" className="bg-gray-700 rounded-md p-2">
                  <img src="/api/placeholder/32/32" alt="TikTok" className="w-8 h-8" />
                </a>
                <a href="#" className="bg-blue-600 rounded-md p-2">
                  <Facebook size={32} />
                </a>
                <a href="#" className="bg-pink-600 rounded-md p-2">
                  <Instagram size={32} />
                </a>
                <a href="#" className="bg-orange-600 rounded-md p-2">
                  <img src="/api/placeholder/32/32" alt="Shopee" className="w-8 h-8" />
                </a>
                <a href="#" className="bg-blue-500 rounded-md p-2">
                  <img src="/api/placeholder/32/32" alt="Zalo" className="w-8 h-8" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">CHẤP NHẬN THANH TOÁN</h3>
              <div className="flex space-x-2">
                <div className="bg-white p-2 rounded-md">
                  <img src="/api/placeholder/48/32" alt="ATM" className="h-8" />
                </div>
                <div className="bg-white p-2 rounded-md">
                  <img src="/api/placeholder/48/32" alt="Cash" className="h-8" />
                </div>
                <div className="bg-white p-2 rounded-md">
                  <img src="/api/placeholder/48/32" alt="MB Bank" className="h-8" />
                </div>
                <div className="bg-white p-2 rounded-md">
                  <img src="/api/placeholder/48/32" alt="Vietcombank" className="h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8">
          <img src="/api/placeholder/400/200" alt="Store Location Map" className="w-full h-auto rounded-md" />
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Company Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">APH PERFUME - Đỉnh cao nước hoa chiết chính hãng</h2>
          <p className="mb-1">Địa chỉ: 11 Nguyễn Đình Chiểu - Phường Đa Kao - Quận 1 - TP. Hồ Chí Minh</p>
          <p className="mb-1">Điện thoại: 012356789/ Email: aphperfume@gmail.com</p>
          <p className="mb-1">© 2025 APH Perfume. All Right Reserved</p>
          <p>Design & Build By An - Phat - Huy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;