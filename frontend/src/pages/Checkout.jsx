import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService, orderService } from '../services/api';
import { formatPrice } from '../utils/currency';
import { ShoppingBag, ChevronLeft, MapPin, Phone, User, MessageCircle } from 'lucide-react';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        note: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await productService.getOne(id);
                if (data.status === 'SOLD') {
                    alert('This item is already sold.');
                    navigate('/');
                }
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await orderService.create({
                productId: id,
                ...formData
            });
            navigate('/order-success');
        } catch (error) {
            alert('Error creating order: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!product) return null;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-black mb-10 transition-colors"
            >
                <ChevronLeft size={20} className="mr-1" />
                Back to Item
            </button>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Form Section */}
                <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-10 flex items-center">
                        <ShoppingBag className="mr-4" size={36} />
                        Checkout
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-gray-900 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-gray-900 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                        placeholder="Your contact number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Shipping Address</label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <MapPin size={18} />
                                </div>
                                <input
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-gray-900 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                    placeholder="Enter your delivery address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Notes (Optional)</label>
                            <div className="relative">
                                <div className="absolute left-5 top-8 -translate-y-1/2 text-gray-400">
                                    <MessageCircle size={18} />
                                </div>
                                <textarea
                                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-gray-900 focus:ring-2 focus:ring-black/5 transition-all outline-none min-h-[140px]"
                                    placeholder="Anything else we should know?"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-6 rounded-3xl font-bold text-xl shadow-2xl transition-all ${submitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 shadow-black/10'
                                }`}
                        >
                            {submitting ? 'Processing Order...' : `Confirm Purchase · ${formatPrice(product.price, i18n.language)}`}
                        </button>
                    </form>
                </div>

                {/* Summary Section */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-white border border-gray-100 rounded-[32px] p-8 sticky top-24 shadow-sm">
                        <h2 className="text-xl font-bold mb-8">Order Summary</h2>

                        <div className="flex gap-4 mb-8 pb-8 border-b border-gray-50">
                            <div className="w-32 aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                                <img
                                    src={product.imageUrls[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight mb-1">{product.title}</h3>
                                <p className="text-sm text-gray-400 mb-2">{product.categoryName}</p>
                                <span className="font-bold text-lg">{formatPrice(product.price, i18n.language)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-500">
                                <span>Item Price</span>
                                <span>{formatPrice(product.price, i18n.language)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-500 font-medium">Free</span>
                            </div>
                            <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-end">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-black">{formatPrice(product.price, i18n.language)}</span>
                            </div>
                        </div>

                        <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                This is a secondhand item. By confirming, you agree to our terms of service regarding peer-to-peer transactions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
