import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await productService.getById(id);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const addToCart = () => {
        if (!product || product.status === 'SOLD') return;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        navigate('/cart');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white pt-20">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('common.loading')}</span>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">{t('product_detail.product_not_found')}</h2>
            <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-black text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
                {t('common.try_different')}
            </button>
        </div>
    );

    const images = product.imageUrls && product.imageUrls.length > 0
        ? product.imageUrls
        : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'];

    return (
        <div className="pt-20 md:pt-28 min-h-screen pb-32 md:pb-20 max-w-7xl mx-auto relative bg-white">
            <div className="px-4 md:px-8 mb-6 md:mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                    <ArrowLeft size={16} /> {t('product_detail.back')}
                </button>
            </div>

            <div className="px-0 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

                <div className="relative group">
                    <div className="aspect-[4/5] md:rounded-3xl overflow-hidden bg-gray-50 relative">
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                        <img
                            src={images[activeImageIndex]}
                            alt={product.title}
                            className={`w-full h-full object-cover transition-transform duration-700 ${product.status === 'SOLD' ? 'grayscale opacity-80' : 'group-hover:scale-105'}`}
                        />
                        {product.status === 'SOLD' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                                <div className="bg-white px-8 py-3 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-sm shadow-xl border border-gray-100 rotate-[-10deg]">
                                    {t('common.sold')}
                                </div>
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full hidden md:flex">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 md:px-0 py-2 md:py-8 sticky top-28">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            {t(`categories.${product.categoryName}`, { defaultValue: product.categoryName })}
                        </span>
                        <div className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-600 border border-gray-100 uppercase tracking-widest">
                            {t(`conditions.${product.conditionStatus}`)}
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4 leading-tight">
                        {product.title}
                    </h1>

                    <p className="text-2xl font-medium text-gray-500 mb-8">
                        {formatPrice(product.price)}
                    </p>

                    <div className="space-y-6 mb-12 border-y border-gray-100 py-8">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t('common.description')}</h3>
                            <p className="text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <Truck className="text-gray-400" size={24} />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-900">{t('product_detail.fast_delivery')}</span>
                                <span className="text-[10px] text-gray-400 font-medium">2-4 Business Days</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <ShieldCheck className="text-gray-400" size={24} />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-900">{t('product_detail.authentic')}</span>
                                <span className="text-[10px] text-gray-400 font-medium">Verified by Team</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={addToCart}
                        disabled={product.status === 'SOLD'}
                        className={`hidden md:flex w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-sm items-center justify-center gap-2 transition-all shadow-lg ${product.status === 'SOLD'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
                            : 'bg-black text-white hover:scale-[1.02] hover:shadow-black/20'
                            }`}
                    >
                        <ShoppingBag size={18} />
                        {product.status === 'SOLD' ? t('common.sold') : t('product_detail.add_to_archive')}
                    </button>
                </div>
            </div>

            <div className="fixed bottom-6 left-4 right-4 z-40 md:hidden flex gap-4">
                <button
                    onClick={addToCart}
                    disabled={product.status === 'SOLD'}
                    className={`flex-1 h-16 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-colors ${product.status === 'SOLD'
                        ? 'bg-gray-200 text-gray-500 shadow-none'
                        : 'bg-black/95 backdrop-blur-md text-white border border-white/10'
                        }`}
                >
                    <ShoppingBag size={18} />
                    {product.status === 'SOLD' ? t('common.sold') : t('product_detail.add_price', { price: formatPrice(product.price) })}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
