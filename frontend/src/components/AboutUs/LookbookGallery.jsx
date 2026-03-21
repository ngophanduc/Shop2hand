import React from 'react';
import { useTranslation } from 'react-i18next';

const images = import.meta.glob('../../assets/AboutUs/LookbookGallery/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const imageUrls = Object.values(images).map((module) => module.default);

const defaultImages = [
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800',
    'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800',
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=800',
    'https://images.unsplash.com/photo-1499939667766-4afceb292d05?q=80&w=800'
];

const galleryImages = imageUrls.length >= 4 ? imageUrls.slice(0, 4) : defaultImages;

const LookbookGallery = () => {
    const { t } = useTranslation();
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-4">{t('about_us.lookbook_title')}</h2>
                <p className="text-gray-500 font-light text-lg">{t('about_us.lookbook_desc')}</p>
            </div>

            <div className="flex gap-4 md:gap-8 px-4 md:px-8 overflow-x-auto pb-8 snap-x custom-scrollbar">
                {galleryImages.map((src, idx) => (
                    <div key={idx} className="w-[80vw] md:w-[400px] shrink-0 aspect-[3/4] rounded-[2rem] overflow-hidden group snap-center relative">
                        <img
                            src={src}
                            alt={`Lookbook ${idx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LookbookGallery;
