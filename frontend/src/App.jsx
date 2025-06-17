import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Cart from "./pages/Cart";
import "./App.css";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import TestProduct from "./pages/TestProduct";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Wishlist from "./pages/WishList";
import ChatBot from "./components/Chatbot";
import { Toaster } from "sonner";
import MbBankPage from "./pages/payment/MbBankPage";
import PaymentReturn from "./pages/payment/PaymentReturn";
import VnPayPage from "./pages/payment/VnPayPage";
import PaymentResult from "./pages/payment/PaymentResult";
import ProductListByBrand from "./pages/ProductListByBrand";
import AllBrands from "./pages/AllBrand";
import Blog from "./pages/Blog";
import ProductListByGender from "./pages/ProductListByGender";
import NotFound from "./pages/NotFound";
import { WishlistProvider } from "./context/WishlistContext";
import ProductListBySeason from "./pages/ProductListBySeason";
import ProductListByNewProduct from "./pages/ProductByNewProduct";
import ProductListByBestSellerProduct from "./pages/ProductListByBestSeller";
import ProductListBySearch from "./pages/ProductListBySearch";

function App() {
  return (
    <Router> 
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <div>
          <Toaster
  richColors
  position="top-right"
  toastOptions={{
    duration: 1000 // thời gian hiển thị toast (mặc định là 4000ms)
  }}
/>

            <Navbar />
            <Navigation />
            <main>
              <ChatBot />
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/:category" element={<ProductList />} /> */}
                <Route path="/brand" element={<AllBrands />} />
                <Route path="/products/brand/:brandName" element={<ProductListByBrand />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/test" element={<TestProduct />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="*" element={<NotFound/>} />
                <Route path="/vnpay-payment" element={<VnPayPage />} />
                <Route path="/mbbank-payment" element={<MbBankPage />} />
                <Route path="/payment-return" element={<PaymentReturn />} />
                <Route path="/payment-result" element={<PaymentResult />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/category" element={<ProductListByGender />} />
                <Route path="/products/season" element={<ProductListBySeason />} />
                <Route path="products/new-product" element={<ProductListByNewProduct />} />
                <Route path="products/best-seller" element={<ProductListByBestSellerProduct />} />
                <Route path="/search" element={<ProductListBySearch />} />


                
              </Routes>
            </main>
            <Footer />
          </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
