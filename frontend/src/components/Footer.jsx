import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="inline-block font-black text-3xl tracking-tighter mb-6 text-white hover:text-gray-300 transition-colors">
                            passgiay
                        </Link>
                        <p className="text-gray-400 font-light max-w-sm leading-relaxed">
                            {t('footer.desc')}
                        </p>
                        <div className="mt-6 flex items-center text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 w-fit hover:border-gray-600 transition-colors">
                            <Phone className="w-5 h-5 mr-3 text-white" />
                            <a href="tel:0901964692" className="hover:text-white transition-colors text-lg tracking-wider font-medium font-mono">
                                0901964692
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6">{t('footer.navigation')}</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('navbar.home')}</Link></li>
                            <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('navbar.shop')}</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('navbar.about_us')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6">{t('footer.legal')}</h4>
                        <ul className="space-y-4">
                            <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('footer.terms')}</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('footer.privacy')}</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('footer.returns')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-900 pt-8 gap-6">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest text-center md:text-left">
                        {t('footer.rights')}
                    </p>
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/pass.giay/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all">
                            <Instagram size={18} />
                        </a>
                        <a href="https://www.facebook.com/hahahihi2222" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all">
                            <Facebook size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
