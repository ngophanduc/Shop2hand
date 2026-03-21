import React from 'react';
import { useTranslation } from 'react-i18next';

const images = import.meta.glob('../../assets/AboutUs/BehindScenes/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const imageUrls = Object.values(images).map((module) => module.default);
const bgImage = imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600';

const BehindScenes = () => {
    const { t } = useTranslation();
    return (
        <section className="py-24 bg-black text-white relative flex items-center justify-center min-h-[500px] overflow-hidden">
            <img
                src={bgImage}
                alt="Sourcing vintage clothes"
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
            />
            <div className="relative z-10 text-center px-4 max-w-3xl border border-white/20 p-12 md:p-20 rounded-[3rem] backdrop-blur-sm bg-black/30">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">{t('about_us.behind_scenes')}</h2>
                <p className="text-gray-300 font-light text-lg md:text-xl leading-relaxed">
                    {t('about_us.behind_desc')}
                </p>
            </div>
        </section>
    );
};

export default BehindScenes;
