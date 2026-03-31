import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Share2, Heart, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const ProductModal = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const images = product.imageUrls.length > 0 ? product.imageUrls : ['https://images.unsplash.com/photo-1594411133999-119c631405fc?w=800&q=80'];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* Image Slider Section */}
                    <div className="md:w-3/5 relative bg-gray-50 aspect-[3/4] flex items-center justify-center overflow-hidden">
                        <img
                            src={images[currentImageIndex]}
                            alt={product.title}
                            className={`w-full h-full object-cover ${product.status === 'SOLD' ? 'grayscale opacity-75' : ''}`}
                        />
                        {product.status === 'SOLD' && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <span className="bg-black/60 backdrop-blur-xl text-white text-sm font-black px-6 py-3 rounded-full uppercase tracking-[0.2em] shadow-2xl">
                                    {t('common.sold', { defaultValue: 'SOLD' })}
                                </span>
                            </div>
                        )}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 p-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 p-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === i ? 'w-4 bg-white' : 'bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="md:w-2/5 p-8 flex flex-col">
                        <div className="mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">
                                {t(`categories.${product.categoryName}`, { defaultValue: product.categoryName })} • {t(`conditions.${product.conditionStatus}`, { defaultValue: product.conditionStatus?.replace('_', ' ') })}
                            </span>
                            <h2 className="text-3xl font-bold text-primary mb-2 leading-tight">{product.title}</h2>
                            <p className="text-2xl font-black text-black">{formatPrice(product.price, i18n.language)}</p>
                            {product.size && (
                                <div className="mt-6">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Sizes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(['Shoes', 'Shirt', 'Pants'].includes(product.categoryName) ? (product.categoryName === 'Shoes' ? SHOE_SIZES : CLOTHING_SIZES) : []).map(size => {
                                            const isAvailable = product.size.split(',').includes(size);
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto mb-8 pr-2">
                            <h4 className="text-sm font-semibold mb-2 text-gray-900">{t('common.description')}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                                {product.description || t('common.no_description')}
                            </p>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mt-auto">
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate(`/checkout/${product.id}`)}
                                    disabled={product.status === 'SOLD'}
                                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${product.status === 'SOLD'
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-black text-white hover:bg-gray-800 shadow-black/10'
                                        }`}
                                >
                                    <ShoppingBag size={20} />
                                    {product.status === 'SOLD' ? t('common.sold') : t('common.buy_now')}
                                </button>
                                <button className="w-full border border-gray-100 py-4 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Heart size={20} className="text-gray-400 mr-2" />
                                    <span className="text-sm font-semibold text-gray-600">Save to Wishlist</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
