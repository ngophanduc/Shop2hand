import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AboutUs from './pages/AboutUs';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

function AppContent({ user, handleLogin, handleLogout }) {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail user={user} />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register onLogin={handleLogin} />} />
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/:id" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                </Routes>
            </main>
            {!isDashboard && <Footer />}
            <ChatWidget currentUser={user} />
        </div>
    );
}

function App() {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.error('Error parsing user from localStorage', e);
            return null;
        }
    });

    const handleLogin = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <Router>
            <AppContent user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
        </Router>
    );
}

export default App;
