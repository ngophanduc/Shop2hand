import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { LayoutGrid, Filter, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [fetching, setFetching] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchCategories();
    }, []);

    // Debounce search only
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Immediate category filter + debounced search
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, debouncedSearch]);

    const fetchCategories = async () => {
        try {
            const { data } = await categoryService.getAll();
            const categoriesData = Array.isArray(data) ? data : [];
            console.log('Home categories:', categoriesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const fetchProducts = async () => {
        // Only show skeleton on very first load
        if (products.length === 0) {
            setLoading(true);
        } else {
            setFetching(true);
        }

        try {
            const { data } = await productService.getAll(selectedCategory, debouncedSearch);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search Bar Section */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
                    Find something <span className="text-gray-400">special.</span>
                </h1>
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder={t('common.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border-none rounded-[28px] text-lg font-medium focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder:text-gray-300"
                    />
                </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === null
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {t('common.all_items')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-5 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.id
                                ? 'bg-black text-white shadow-lg shadow-black/10'
                                : 'bg-white border border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
                                }`}
                        >
                            {t(`categories.${cat.name}`, { defaultValue: cat.name })}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <LayoutGrid size={16} />
                    <span>{products.length} {t('common.products_found', { defaultValue: 'products found' })}</span>
                </div>
            </div>

            {/* Product Grid - Fixed min-height to prevent jumping */}
            <div className={`min-h-[600px] transition-opacity duration-300 ${fetching ? 'opacity-50' : 'opacity-100'}`}>
                {loading && products.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-gray-100 rounded-3xl mb-4" />
                                <div className="h-4 bg-gray-100 rounded-lg w-3/4 mb-2" />
                                <div className="h-4 bg-gray-100 rounded-lg w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={setSelectedProduct}
                            />
                        ))}
                    </div>
                ) : !loading && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('common.no_products')}</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">{t('common.try_different')}</p>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Home;
