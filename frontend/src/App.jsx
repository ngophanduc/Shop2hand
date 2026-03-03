import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Navbar from './components/Navbar';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

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
            <div className="min-h-screen">
                <Navbar user={user} onLogout={handleLogout} />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register onLogin={handleLogin} />} />
                        <Route path="/dashboard" element={<Dashboard user={user} />} />
                        <Route path="/checkout/:id" element={<Checkout />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
