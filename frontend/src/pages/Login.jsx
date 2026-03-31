import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isExpired = searchParams.get('expired') === 'true';
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await authService.login(formData);
            onLogin(data, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || t('auth.login_failed', { defaultValue: 'Login failed. Please check your credentials.' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50/50">
            <div className="max-w-md w-full">
                <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-2">{t('auth.welcome_back')}</h2>
                        <p className="text-gray-500 text-sm">{t('auth.sign_in_desc')}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {isExpired && !error && (
                        <div className="mb-6 p-4 bg-amber-50 text-amber-700 rounded-2xl text-sm font-medium border border-amber-100">
                            {t('auth.session_expired', { defaultValue: 'Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.' })}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">{t('auth.username')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm outline-none"
                                    placeholder={t('auth.enter_username')}
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            {loading ? t('auth.authenticating') : t('common.login')}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        {t('auth.dont_have_account')}{' '}
                        <Link to="/register" className="text-black font-bold hover:underline">
                            {t('auth.register_now', { defaultValue: 'Register now' })}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
