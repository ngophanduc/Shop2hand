import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const images = import.meta.glob('../../assets/AboutUs/CTASection/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const imageUrls = Object.values(images).map((module) => module.default);
const bgImage = imageUrls.length > 0 ? imageUrls[0] : '';

const CTASection = () => {
    const { t } = useTranslation();
    return (
        <section
            className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden"
            style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' } : { backgroundColor: '#000' }}
        >
            <div className="absolute inset-0 bg-black/60 z-10" />

            <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 uppercase tracking-wide leading-tight">
                    {t('about_us.cta_title')}
                </h2>
                <p className="text-gray-300 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
                    {t('about_us.cta_desc')}
                </p>
                <Link
                    to="/shop"
                    className="inline-flex items-center justify-center bg-white text-black px-12 h-14 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-105 shadow-xl"
                >
                    {t('about_us.shop_now_btn')}
                </Link>
            </div>
        </section>
    );
};

export default CTASection;
