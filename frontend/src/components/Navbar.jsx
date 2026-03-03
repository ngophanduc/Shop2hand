import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, PlusCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingBag className="text-white w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Shop2Hand</span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-xs font-bold"
                    >
                        <Globe size={14} />
                        <span>{i18n.language === 'vi' ? 'EN' : 'VI'}</span>
                    </button>

                    {user && user.role === 'ADMIN' ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <PlusCircle size={18} />
                                <span>{t('common.sell_item')}</span>
                            </Link>
                            <button
                                onClick={() => { onLogout(); navigate('/'); }}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                title={t('common.logout')}
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : user ? (
                        <button
                            onClick={() => { onLogout(); navigate('/'); }}
                            className="p-4 text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">{t('common.logout')}</span>
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-black transition-colors"
                        >
                            <User size={18} />
                            <span>{t('common.login')}</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
