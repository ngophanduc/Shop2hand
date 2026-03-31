import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import { Plus, Edit2, Trash2, Package, Image as ImageIcon, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';
import ProductForm from '../components/ProductForm';

const Dashboard = ({ user }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();


    const [products, setProducts] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearch, selectedCategoryId, statusFilter]);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchAllData();
        
        // Listen for real-time updates via SSE
        const eventSource = new EventSource('/api/sse/products');
        eventSource.addEventListener('PRODUCT_UPDATE', () => {
            console.log('Real-time update received');
            fetchAllData(true); // Silent update for SSE
        });

        return () => {
            eventSource.close();
        };
    }, [user, currentPage, debouncedSearch, selectedCategoryId, statusFilter]);

    const fetchAllData = async (silent = false) => {
        if (!silent) setLoading(true);
        await Promise.allSettled([
            fetchProducts(silent),
            fetchCategories()
        ]);
        if (!silent) setLoading(false);
    };

    const fetchProducts = async (silent = false) => {
        try {
            const res = await productService.getAll(
                selectedCategoryId || null, 
                debouncedSearch || null, 
                statusFilter || null,
                currentPage, 
                pageSize
            );
            setProducts(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAll();
            const categoriesData = Array.isArray(res.data) ? res.data : [];
            console.log('Fetched categories:', categoriesData);
            setCategories(categoriesData);
            if (categoriesData.length === 0) {
                console.warn('Categories API returned an empty list');
            }
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleToggleSold = async (product) => {
        const newStatus = product.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
        try {
            const formDataToSend = new FormData();
            const productBlob = new Blob([JSON.stringify({
                title: product.title,
                description: product.description,
                price: product.price,
                conditionStatus: product.conditionStatus,
                categoryId: product.categoryId,
                status: newStatus
            })], { type: 'application/json' });
            formDataToSend.append('product', productBlob);

            await productService.update(product.id, formDataToSend);
            fetchAllData(true); // Silent update for manual toggle
        } catch (error) {
            console.error('Error toggling sold status:', error);
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
                alert(`Failed to update status: ${errorMessage}`);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.delete(id);
                fetchAllData();
            } catch (error) {
                if (error.response?.status !== 401 && error.response?.status !== 403) {
                    alert('Error deleting product');
                }
            }
        }
    };

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const resetForm = () => {
        setEditingProduct(null);
        setShowForm(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">{t('dashboard.title')}</h1>
                    <p className="text-gray-500">{t('dashboard.welcome', { name: user?.username })}</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                >
                    <Plus size={20} />
                    <span>{t('dashboard.add_new')}</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('common.search_placeholder', { defaultValue: 'Search products...' })}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                </div>
                
                <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-black cursor-pointer appearance-none"
                >
                    <option value="">{t('common.all_categories', { defaultValue: 'All Categories' })}</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {t(`categories.${cat.name}`, { defaultValue: cat.name })}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-black cursor-pointer appearance-none"
                >
                    <option value="">{t('dashboard.all_status', { defaultValue: 'All Statuses' })}</option>
                    <option value="AVAILABLE">{t('dashboard.status_available', { defaultValue: 'Available' })}</option>
                    <option value="SOLD">{t('dashboard.status_sold', { defaultValue: 'Sold' })}</option>
                </select>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-400">{t('common.loading')}</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div key={p.id} className={`bg-white border border-gray-100 rounded-3xl p-6 flex flex-col h-full shadow-soft transition-all ${p.status === 'SOLD' ? 'grayscale opacity-75 bg-gray-50' : ''}`}>
                            <div className="flex gap-4 mb-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                                    <img
                                        src={p.imageUrls[0] || 'https://images.unsplash.com/photo-1594411133999-119c631405fc?w=200&q=80'}
                                        className="w-full h-full object-cover"
                                    />
                                    {p.status === 'SOLD' && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{t('common.sold', { defaultValue: 'SOLD' })}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-primary truncate">{p.title}</h3>
                                    <p className="text-xl font-black text-black mb-1">{formatPrice(p.price, i18n.language)}</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-gray-50 px-2 py-1 rounded-md">
                                            {t(`conditions.${p.conditionStatus}`, { defaultValue: p.conditionStatus.replace('_', ' ') })}
                                        </span>
                                        {p.status === 'SOLD' && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50 px-2 py-1 rounded-md">
                                                {t('common.sold', { defaultValue: 'SOLD' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleToggleSold(p)}
                                    className={`col-span-2 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${p.status === 'SOLD'
                                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <Package size={16} />
                                    <span>{p.status === 'SOLD' ? t('dashboard.mark_available', { defaultValue: 'Mark Available' }) : t('dashboard.mark_sold', { defaultValue: 'Mark as Sold' })}</span>
                                </button>
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    <Edit2 size={16} />
                                    <span>{t('dashboard.edit')}</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    <span>{t('dashboard.delete')}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <Package className="mx-auto mb-4 text-gray-300" size={48} />
                    <h3 className="text-xl font-bold text-gray-900">{t('dashboard.no_products_yet')}</h3>
                    <p className="text-gray-500 mb-8">{t('dashboard.start_selling_desc')}</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                    >
                        <Plus size={20} />
                        <span>{t('dashboard.create_first')}</span>
                    </button>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-12 pb-10 border-t border-gray-100 pt-10">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold uppercase tracking-widest text-black">Page {currentPage + 1}</span>
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-300">of {totalPages}</span>
                    </div>

                    <button
                        disabled={currentPage === totalPages - 1}
                        onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <ProductForm 
                    product={editingProduct}
                    categories={categories}
                    onSuccess={() => {
                        resetForm();
                        fetchAllData();
                    }}
                    onCancel={() => resetForm()}
                />
            )}
        </div>
    );
};

export default Dashboard;
