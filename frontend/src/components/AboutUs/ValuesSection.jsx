import React from 'react';
import { Leaf, ShieldCheck, Gem } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ValuesSection = () => {
    const { t } = useTranslation();
    const values = [
        {
            icon: <Leaf size={32} />,
            title: t('about_us.sustainability'),
            desc: t('about_us.sustainability_desc')
        },
        {
            icon: <ShieldCheck size={32} />,
            title: t('about_us.authenticity'),
            desc: t('about_us.authenticity_desc')
        },
        {
            icon: <Gem size={32} />,
            title: t('about_us.curation'),
            desc: t('about_us.curation_desc')
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
                        <div key={idx} className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-black mb-8 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                {v.icon}
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-black">{v.title}</h3>
                            <p className="text-gray-500 font-light leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
