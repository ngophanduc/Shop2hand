import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm">
                    <CheckCircle size={48} className="text-green-500" />
                </div>

                <h1 className="text-4xl font-black mb-4">Order Placed!</h1>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                    Thank you for your purchase. The seller will be notified and will contact you shortly to arrange delivery.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-black text-white py-5 rounded-3xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center"
                    >
                        <Home className="mr-2" size={20} />
                        Back to Home
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-white text-black py-5 rounded-3xl font-bold text-lg hover:bg-gray-50 border border-gray-100 transition-all flex items-center justify-center"
                    >
                        <ShoppingBag className="mr-2" size={20} />
                        My Purchases
                    </button>
                </div>

                <div className="mt-16 pt-10 border-t border-gray-50">
                    <p className="text-sm text-gray-400">
                        Need help? <a href="#" className="text-black font-bold hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
