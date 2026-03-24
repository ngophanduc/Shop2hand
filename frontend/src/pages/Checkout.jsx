import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, AlertTriangle, Instagram, Facebook } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-gray-50/50">
            <div className="max-w-xl w-full mt-8 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amber-50 to-orange-50 -z-10 rounded-t-[2rem]"></div>

                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-white shadow-sm">
                    <AlertTriangle size={48} />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                    Checkout Unavailable
                </h1>

                <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                    We're sincerely sorry, but our automated checkout system is currently undergoing maintenance. Please reach out to us directly to complete your order or for any assistance.
                </p>

                <div className="bg-gray-50 rounded-3xl p-6 md:p-8 mb-10 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Contact Us Fast</h3>

                    <div className="flex flex-col gap-4">
                        {/* Phone */}
                        <a
                            href="tel:0901964692"
                            className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 px-6 rounded-2xl hover:bg-gray-800 transition-all font-mono font-bold text-lg hover:-translate-y-1 hover:shadow-xl shadow-black/10"
                        >
                            <Phone size={22} className="text-gray-300" />
                            0901964692
                        </a>

                        <div className="flex gap-4">
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/pass.giay/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white py-4 px-6 rounded-2xl hover:opacity-90 transition-all font-bold hover:-translate-y-1 hover:shadow-xl shadow-pink-500/20"
                            >
                                <Instagram size={20} />
                                <span className="hidden sm:inline">Instagram</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/hahahihi2222"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-4 px-6 rounded-2xl hover:bg-[#166fe5] transition-all font-bold hover:-translate-y-1 hover:shadow-xl shadow-blue-500/20"
                            >
                                <Facebook size={20} />
                                <span className="hidden sm:inline">Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-black font-bold transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    Return to previous page
                </button>
            </div>
        </div>
    );
};

export default Checkout;
