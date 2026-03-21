import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [conditionFilter, setConditionFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, debouncedSearch]);

    useEffect(() => {
        applyFrontendFilters();
    }, [products, sortBy, conditionFilter]);

    const fetchCategories = async () => {
        try {
            const { data } = await categoryService.getAll();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const fetchProducts = async () => {
        if (products.length === 0) setLoading(true);
        else setFetching(true);

        try {
            const { data } = await productService.getAll(selectedCategory, debouncedSearch);
            setProducts(Array.isArray(data) ? data : (data?.content || []));
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    const applyFrontendFilters = () => {
        let result = [...products];

        if (conditionFilter !== 'all') {
            result = result.filter(p => p.conditionStatus === conditionFilter);
        }

        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else {
            result.sort((a, b) => b.id - a.id);
        }

        setFilteredProducts(result);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="pt-24 min-h-screen pb-32 md:pb-24 bg-white relative">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-black">
                            {t('shop.title')}
                        </h1>
                        <p className="text-gray-500 font-light text-sm tracking-wide">
                            {t('shop.pieces_available', { count: filteredProducts.length })}
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder={t('common.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-black/10 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="hidden md:block w-64 flex-shrink-0">
                        <div className="sticky top-28 space-y-10">

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{t('common.categories')}</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className={`w-full text-left text-sm font-bold transition-colors ${selectedCategory === null ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                                        >
                                            {t('common.all_items')}
                                        </button>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`w-full text-left text-sm font-bold transition-colors ${selectedCategory === cat.id ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                                            >
                                                {t(`categories.${cat.name}`, { defaultValue: cat.name })}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{t('shop.sort_by')}</h3>
                                <div className="space-y-3">
                                    {['newest', 'price-asc', 'price-desc'].map(sortVal => (
                                        <label key={sortVal} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === sortVal}
                                                onChange={() => setSortBy(sortVal)}
                                                className="w-5 h-5 accent-black bg-gray-100 border-none cursor-pointer"
                                            />
                                            <span className={`text-sm font-bold transition-colors ${sortBy === sortVal ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
                                                {sortVal === 'newest' ? t('shop.sort_newest') : sortVal === 'price-asc' ? t('shop.sort_price_asc') : t('shop.sort_price_desc')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{t('shop.condition_rating')}</h3>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                                    value={conditionFilter}
                                    onChange={(e) => setConditionFilter(e.target.value)}
                                >
                                    <option value="all">{t('shop.any_condition')}</option>
                                    <option value="NEW">{t('conditions.NEW')}</option>
                                    <option value="LIKE_NEW">{t('conditions.LIKE_NEW')}</option>
                                    <option value="GOOD">{t('conditions.GOOD')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-w-0">
                        <div className={`transition-opacity duration-300 ${fetching ? 'opacity-50' : 'opacity-100'}`}>
                            {loading && products.length === 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-4" />
                                            <div className="h-4 bg-gray-100 rounded-lg w-3/4 mb-2" />
                                            <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : currentItems.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6">
                                        {currentItems.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-6 mt-20 pb-10 border-t border-gray-100 pt-10">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-colors"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold uppercase tracking-widest text-black">Page {currentPage}</span>
                                                <span className="text-sm font-bold uppercase tracking-widest text-gray-300">of {totalPages}</span>
                                            </div>

                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-colors"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : !loading && (
                                <div className="text-center py-32 bg-gray-50 rounded-[32px] border border-gray-100">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm border border-gray-100">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{t('shop.no_items_title')}</h3>
                                    <p className="text-gray-500 font-light mt-2 max-w-sm mx-auto">
                                        {t('shop.no_items_desc')}
                                    </p>
                                    <button
                                        onClick={() => { setSelectedCategory(null); setSortBy('newest'); setConditionFilter('all'); setSearchQuery(''); }}
                                        className="mt-8 px-8 h-12 rounded-full bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors shadow-sm"
                                    >
                                        {t('shop.reset_filters')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="bg-black/95 backdrop-blur-md text-white h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_10px_40px_rgba(0,0,0,0.3)] min-w-[160px] flex items-center justify-center gap-2 hover:bg-black transition-colors"
                >
                    <SlidersHorizontal size={16} /> {t('shop.filters_and_sort')}
                </button>
            </div>

            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${showMobileFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowMobileFilters(false)} />
            <div className={`fixed bottom-0 left-0 w-full bg-white rounded-t-3xl z-50 p-6 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden max-h-[85vh] flex flex-col ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 shrink-0" />

                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 shrink-0">{t('shop.filters_and_sort')}</h3>

                <div className="flex-1 overflow-y-auto pb-6 space-y-8 custom-scrollbar">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">{t('common.categories')}</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors ${selectedCategory === null ? 'bg-black text-white' : 'bg-gray-50 text-gray-600'}`}
                            >
                                {t('common.all_items')}
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors ${selectedCategory === cat.id ? 'bg-black text-white' : 'bg-gray-50 text-gray-600'}`}
                                >
                                    {t(`categories.${cat.name}`, { defaultValue: cat.name })}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">{t('shop.sort_options')}</span>
                        <select
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-black appearance-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">{t('shop.sort_newest')}</option>
                            <option value="price-asc">{t('shop.sort_price_asc')}</option>
                            <option value="price-desc">{t('shop.sort_price_desc')}</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">{t('shop.condition_rating')}</span>
                        <select
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-black appearance-none"
                            value={conditionFilter}
                            onChange={(e) => setConditionFilter(e.target.value)}
                        >
                            <option value="all">{t('shop.any_condition')}</option>
                            <option value="NEW">{t('conditions.NEW')}</option>
                            <option value="LIKE_NEW">{t('conditions.LIKE_NEW')}</option>
                            <option value="GOOD">{t('conditions.GOOD')}</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 shrink-0">
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl"
                    >
                        {t('shop.show_items', { count: filteredProducts.length })}
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
            `}</style>
        </div>
    );
};

export default Shop;
