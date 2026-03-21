import React from 'react';
import { useTranslation } from 'react-i18next';

const images = import.meta.glob('../../assets/AboutUs/StorySection/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const imageUrls = Object.values(images).map((module) => module.default);
const storyImage = imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800';

const StorySection = () => {
    const { t } = useTranslation();
    return (
        <section className="py-24 md:py-32 bg-white text-black px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{t('about_us.story_title')}</h2>
                    <p className="text-lg text-gray-600 font-light leading-relaxed">
                        {t('about_us.story_desc1')}
                    </p>
                    <p className="text-lg text-gray-600 font-light leading-relaxed">
                        {t('about_us.story_desc2')}
                    </p>
                </div>
                <div className="order-1 md:order-2 aspect-[4/5] bg-gray-100 rounded-[3rem] overflow-hidden relative group">
                    <img
                        src={storyImage}
                        alt="Our origin"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>
        </section>
    );
};

export default StorySection;
