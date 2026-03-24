import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, PlusCircle, Globe, Menu, X, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo/07654c94b33f3d61642e.jpg';

const Navbar = ({ user, onLogout }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
        };
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    const navLinks = [
        { name: t('common.home'), path: '/' },
        { name: t('navbar.shop'), path: '/shop' },
        { name: t('navbar.about_us'), path: '/about' }
    ];

    const isDarkBackground = (location.pathname === '/' || location.pathname === '/about') && !isScrolled;

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`md:hidden p-2 -ml-2 transition-colors ${isDarkBackground ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-black'}`}
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="flex items-center gap-2 group z-10">
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="w-10 h-10 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300 shadow-md"
                        />
                        <span className={`font-bold text-xl tracking-tight hidden sm:block transition-colors ${isDarkBackground ? 'text-white' : 'text-black'}`}>passgiay</span>
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 justify-center">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === link.path
                                    ? isDarkBackground ? 'text-white' : 'text-black'
                                    : isDarkBackground ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-black'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={toggleLanguage}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl backdrop-blur-sm border transition-colors text-xs font-bold shadow-sm ${isDarkBackground
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            : 'bg-white/80 border-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                    >
                        <Globe size={16} />
                        <span className="hidden sm:inline">{i18n.language === 'vi' ? 'EN' : 'VI'}</span>
                    </button>

                    <Link
                        to="/cart"
                        className={`relative p-2.5 backdrop-blur-sm border transition-colors rounded-2xl shadow-sm ${isDarkBackground
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            : 'bg-white/80 border-gray-100 text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className={`absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold flex items-center justify-center rounded-full border-2 ${isDarkBackground
                                ? 'bg-white text-black border-black/20'
                                : 'bg-black text-white border-white'
                                }`}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        {user && user.role === 'ADMIN' && (
                            <Link
                                to="/dashboard"
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold hover:scale-105 transition-transform shadow-md ${isDarkBackground ? 'bg-white text-black' : 'bg-black text-white'
                                    }`}
                            >
                                <PlusCircle size={18} />
                                <span>{t('common.sell_item')}</span>
                            </Link>
                        )}
                        {user ? (
                            <button
                                onClick={() => { onLogout(); navigate('/'); }}
                                className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-colors shadow-sm ${isDarkBackground
                                    ? 'bg-white/10 border-white/20 text-white hover:bg-red-500 hover:border-red-400'
                                    : 'bg-white/80 border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-100'
                                    }`}
                                title={t('common.logout')}
                            >
                                <LogOut size={20} />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl border text-sm font-bold transition-colors shadow-sm ${isDarkBackground
                                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                    : 'bg-white border-gray-200 text-gray-800 hover:border-black'
                                    }`}
                            >
                                <User size={18} />
                                <span>{t('common.login')}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className={`fixed inset-y-0 left-0 h-screen w-[85vw] max-w-[300px] bg-white z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden flex flex-col shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
                        <span className="font-bold text-xl tracking-tight text-black">Passgiay</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50 bg-gray-50/50"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pt-6 pb-12 px-6 flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{t('navbar.menu')}</span>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-3xl font-black tracking-tight transition-colors px-2 py-1 ${location.pathname === link.path ? 'text-black' : 'text-gray-300 hover:text-gray-800'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <hr className="border-gray-50 flex-none" />

                    <div className="flex flex-col gap-5">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{t('navbar.account')}</span>
                        {user ? (
                            <>
                                {user.role === 'ADMIN' && (
                                    <Link to="/dashboard" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-black transition-colors group">
                                        <div className="flex items-center gap-3 font-semibold text-sm uppercase tracking-wide text-black">
                                            <PlusCircle size={20} className="text-gray-500 group-hover:text-black transition-colors" />
                                            {t('common.dashboard')}
                                        </div>
                                    </Link>
                                )}
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                            <User size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-wide text-black">{user.username || 'User'}</p>
                                            <p className="text-xs text-gray-500 font-light mt-0.5">{user.email || 'Email'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { onLogout(); setIsMobileMenuOpen(false); navigate('/'); }}
                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors shadow-sm"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-black text-white rounded-2xl text-center font-bold tracking-wide uppercase shadow-xl shadow-black/10 hover:bg-gray-900 transition-colors">
                                {t('common.login')} / {t('common.register')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
