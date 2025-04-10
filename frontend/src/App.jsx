import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Cart from './pages/Cart';
import ProductList from './pages/ProductList';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import TestProduct from './pages/TestProduct';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import Wishlist from './pages/WishList';
import ChatBot from './components/Chatbot';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div>
            <Toaster richColors position='top-right' />
            <Navbar />
            <Navigation />
            <main>
              <ChatBot />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path='/:category' element={<ProductList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/test" element={<TestProduct />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/ordersuccess" element={<OrderSuccess />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
