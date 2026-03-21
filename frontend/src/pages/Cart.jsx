import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, []);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = cart.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('storage'));
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('storage'));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center transition-colors duration-300">
                <div className="text-center px-4 max-w-md mx-auto fade-in">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <ShoppingBag size={32} className="text-gray-300" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-4">{t('cart.empty')}</h2>
                    <p className="text-gray-500 font-light mb-10">
                        Looks like you haven't added any archive pieces to your cart yet.
                    </p>
                    <Link to="/shop" className="inline-flex h-14 items-center justify-center px-8 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-xl">
                        {t('cart.continue_shopping')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-40 md:pb-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-gray-100 pb-6 fade-in">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">
                        {t('cart.title')}
                    </h1>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
                        {totalItems} Items
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="lg:col-span-8 space-y-6">
                        {cart.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex gap-4 md:gap-6 bg-white p-4 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors fade-in">
                                <Link to={`/product/${item.id}`} className="w-28 h-36 md:w-40 md:h-48 shrink-0 bg-gray-50 rounded-2xl overflow-hidden group">
                                    <img
                                        src={item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">
                                                {t(`categories.${item.categoryName}`, { defaultValue: item.categoryName })}
                                            </span>
                                            <Link to={`/product/${item.id}`} className="text-lg md:text-xl font-black uppercase tracking-tight text-black hover:text-gray-600 transition-colors line-clamp-2 leading-tight">
                                                {item.title}
                                            </Link>
                                            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                                {t(`conditions.${item.conditionStatus}`)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 bg-gray-50 hover:bg-red-50 rounded-full"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Qty</span>
                                            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity || 1}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-black tracking-tight">{formatPrice(item.price)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-28 bg-gray-50 rounded-3xl p-8 border border-gray-100 fade-in">
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">{t('cart.order_summary')}</h2>

                            <div className="space-y-4 mb-8 text-sm font-medium">
                                <div className="flex justify-between text-gray-500">
                                    <span>{t('cart.subtotal', { count: totalItems })}</span>
                                    <span className="text-black font-bold">{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>{t('cart.estimated_shipping')}</span>
                                    <span className="text-black font-bold uppercase text-[10px] tracking-widest bg-white px-2 py-1 rounded-md">{t('cart.free')}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>{t('cart.taxes')}</span>
                                    <span className="text-black font-bold">{formatPrice(0)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('cart.total')}</span>
                                    <span className="text-3xl font-black tracking-tighter text-black">{formatPrice(totalAmount)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                                <ShieldCheck size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">{t('cart.secure_checkout')}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="hidden md:flex w-full h-14 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-sm items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl"
                            >
                                {t('cart.checkout_now')} <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-40 md:hidden flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{t('cart.estimated_total')}</span>
                    <span className="text-xl font-black text-black tracking-tight">{formatPrice(totalAmount)}</span>
                </div>
                <button
                    onClick={() => navigate('/checkout')}
                    className="h-12 px-6 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                    {t('cart.checkout_now')}
                </button>
            </div>

            <style>{`
                .fade-in { animation: fadeIn 0.6s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Cart;
