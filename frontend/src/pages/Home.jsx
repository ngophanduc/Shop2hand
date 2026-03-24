import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import vintageImg from '../assets/AboutUs/LookbookGallery/3293ec6085cd0b9352dc.jpg';
import streetwearImg from '../assets/AboutUs/LookbookGallery/d21f43ec3941b71fee50.jpg';
import storyImg from '../assets/AboutUs/HeroSection/9902a5df1e73902dc962.jpg';
const images = import.meta.glob('../assets/AboutUs/CTASection/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const imageUrls = Object.values(images).map((module) => module.default);
const heroBgImage = imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1528650017409-90696eb64fcd?w=1600&q=80';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await productService.getAll(null, '');
                setFeatured(Array.isArray(data) ? data.slice(0, 4) : []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="w-full bg-white overflow-hidden">
            <section className="relative h-[85vh] min-h-[600px] w-full bg-black flex items-center justify-center">
                <img
                    src={heroBgImage}
                    alt={t('home.hero_title')}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20 animate-[fadeIn_1s_ease-out_forwards]">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-[1.1] whitespace-nowrap">
                        {t('home.hero_title')}
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light mb-10 max-w-lg mx-auto tracking-wide">
                        {t('home.hero_desc')}
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-xl"
                    >
                        {t('home.shop_collection')} <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black">{t('home.new_arrivals')}</h2>
                        <p className="text-gray-500 font-light tracking-wide mt-2">{t('home.new_arrivals_desc')}</p>
                    </div>
                    <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">
                        {t('home.view_all')} <ArrowRight size={16} />
                    </Link>
                </div>

                {featured.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {featured.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-4" />
                            </div>
                        ))}
                    </div>
                )}

                <Link to="/shop" className="md:hidden mt-8 w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-100 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-black">
                    {t('home.view_all_drop')} <ArrowRight size={16} />
                </Link>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                        <Link to="/shop?category=vintage" className="relative rounded-3xl overflow-hidden group">
                            <img src={vintageImg} alt="Vintage" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute bottom-10 left-10">
                                <h3 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">{t('home.vintage')}</h3>
                                <div className="inline-block bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">{t('home.shop_now')}</div>
                            </div>
                        </Link>
                        <div className="grid grid-rows-2 gap-4">
                            <Link to="/shop?category=streetwear" className="relative rounded-3xl overflow-hidden group">
                                <img src={streetwearImg} alt="Streetwear" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                                <div className="absolute bottom-8 left-8">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">{t('home.streetwear')}</h3>
                                    <div className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">{t('home.explore')}</div>
                                </div>
                            </Link>
                            <Link to="/about" className="relative rounded-3xl overflow-hidden group bg-black">
                                <img src={storyImg} alt="Our Story" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">{t('home.the_archive')}</h3>
                                    <p className="text-gray-300 font-light text-sm max-w-xs mb-6">{t('home.archive_desc')}</p>
                                    <div className="inline-block bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest">{t('home.our_story')}</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Home;
