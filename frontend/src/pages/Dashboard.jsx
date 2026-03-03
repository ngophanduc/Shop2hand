import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import { Plus, Edit2, Trash2, Package, Image as ImageIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';

const Dashboard = ({ user }) => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        conditionStatus: 'USED',
        categoryId: '',
        imageUrls: [''],
        status: 'AVAILABLE'
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchAllData();
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.allSettled([
            fetchProducts(),
            fetchCategories()
        ]);
        setLoading(false);
    };

    const fetchProducts = async () => {
        try {
            const res = await productService.getAll();
            setProducts(res.data);
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
            alert('Failed to load categories. Please check if the backend is running and accessible.');
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formDataToSend = new FormData();

            // Create product blob for @RequestPart("product")
            const productBlob = new Blob([JSON.stringify({
                title: formData.title,
                description: formData.description,
                price: formData.price,
                conditionStatus: formData.conditionStatus,
                categoryId: formData.categoryId,
                status: formData.status
            })], { type: 'application/json' });

            formDataToSend.append('product', productBlob);

            selectedFiles.forEach(file => {
                formDataToSend.append('files', file);
            });

            if (editingProduct) {
                await productService.update(editingProduct.id, formDataToSend);
            } else {
                await productService.create(formDataToSend);
            }
            setShowForm(false);
            resetForm();
            fetchAllData();
        } catch (error) {
            alert('Error saving product: ' + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            conditionStatus: product.conditionStatus,
            categoryId: product.categoryId,
            imageUrls: product.imageUrls,
            status: product.status
        });
        setPreviews(product.imageUrls);
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
            // Append an empty "files" part to ensure multipart request is complete
            formDataToSend.append('files', new Blob([], { type: 'application/octet-stream' }), '');

            await productService.update(product.id, formDataToSend);
            fetchAllData();
        } catch (error) {
            console.error('Error toggling sold status', error);
            alert('Failed to update status: ' + (error.response?.data?.message || error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.delete(id);
                fetchAllData();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            conditionStatus: 'USED',
            categoryId: '',
            imageUrls: [''],
            status: 'AVAILABLE'
        });
        setSelectedFiles([]);
        setPreviews([]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
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

            {loading ? (
                <div className="py-20 text-center text-gray-400">{t('common.loading')}</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div key={p.id} className={`bg-white border border-gray-100 rounded-3xl p-6 flex flex-col shadow-soft transition-all ${p.status === 'SOLD' ? 'grayscale opacity-75 bg-gray-50' : ''}`}>
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

            {/* Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content !max-w-2xl p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">{editingProduct ? t('dashboard.edit_product') : t('dashboard.add_new')}</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('dashboard.product_title')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        {t('dashboard.product_price')} (VNĐ)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('dashboard.product_category')}</label>
                                    <select
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black appearance-none"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">{t('dashboard.select_category', { defaultValue: 'Select Category' })}</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{t(`categories.${c.name}`, { defaultValue: c.name })}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('dashboard.product_condition')}</label>
                                <div className="flex gap-3">
                                    {['NEW', 'LIKE_NEW', 'USED'].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, conditionStatus: status })}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${formData.conditionStatus === status
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            {t(`conditions.${status}`, { defaultValue: status.replace('_', ' ') })}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('dashboard.product_description')}</label>
                                <textarea
                                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black min-h-[120px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block">
                                    {t('dashboard.product_images')}
                                </label>
                                <div className="grid grid-cols-4 gap-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors group">
                                        <ImageIcon className="text-gray-300 group-hover:text-black transition-colors" size={24} />
                                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-black mt-2">{t('dashboard.upload')}</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <p className="text-[10px] text-gray-400 italic">{t('dashboard.cloudinary_note')}</p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full bg-black text-white py-5 rounded-3xl font-bold text-lg transition-all shadow-xl shadow-black/10 mt-4 flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{t('common.processing', { defaultValue: 'Processing...' })}</span>
                                    </>
                                ) : (
                                    editingProduct ? t('dashboard.save_changes') : t('dashboard.create_listing')
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
