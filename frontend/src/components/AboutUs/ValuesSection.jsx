import React from 'react';
import { Leaf, ShieldCheck, Gem } from 'lucide-react';
import { useTranslation } from 'react-i18next';
 
const images = import.meta.glob('../../assets/AboutUs/ValuesSection/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const imageUrls = Object.values(images).map((module) => module.default);
 
const ValuesSection = () => {
    const { t } = useTranslation();
    const values = [
        {
            icon: <Leaf size={24} />,
            title: t('about_us.sustainability'),
            desc: t('about_us.sustainability_desc'),
            image: imageUrls[0]
        },
        {
            icon: <ShieldCheck size={24} />,
            title: t('about_us.authenticity'),
            desc: t('about_us.authenticity_desc'),
            image: imageUrls[3]
        },
        {
            icon: <Gem size={24} />,
            title: t('about_us.curation'),
            desc: t('about_us.curation_desc'),
            image: imageUrls[6]
        }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">{t('about_us.values_title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((v, idx) => (
                        <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group overflow-hidden flex flex-col h-full">
                            {v.image && (
                                <div className="h-64 overflow-hidden relative">
                                    <img 
                                        src={v.image} 
                                        alt={v.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                                </div>
                            )}
                            <div className="p-8 md:p-10 flex flex-col flex-1">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-black mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    {v.icon}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-black">{v.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed flex-1">{v.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
