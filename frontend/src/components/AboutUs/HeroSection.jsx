import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const images = import.meta.glob('../../assets/AboutUs/HeroSection/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const imageUrls = Object.values(images).map((module) => module.default);
const bgImage = imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1550614000-4b95d4ebf0ae?q=80&w=1600';

const HeroSection = () => {
    const { t } = useTranslation();
    return (
        <section className="relative h-screen min-h-[600px] w-full bg-black flex flex-col items-center justify-center overflow-hidden">
            <img
                src={bgImage}
                alt="Vintage clothing rack"
                className="absolute inset-0 w-full h-full object-cover opacity-50 sepia-[.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

            <div className="relative z-10 text-center px-4 mt-20">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                    {t('about_us.hero_title')}
                </h1>
                <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
                    {t('about_us.hero_desc')}
                </p>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('about_us.explore_story')}</span>
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center animate-bounce text-white">
                    <ArrowDown size={16} />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
