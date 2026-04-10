import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';
import { Image as ImageIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductForm = ({ product, categories: initialCategories, onSuccess, onCancel }) => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState(initialCategories || []);
    const [submitting, setSubmitting] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState(product?.imageUrls || []);
    
    const [formData, setFormData] = useState({
        title: product?.title || '',
        description: product?.description || '',
        price: product?.price || '',
        conditionStatus: product?.conditionStatus || 'USED',
        categoryId: product?.categoryId || '',
        status: product?.status || 'AVAILABLE',
        size: product?.size || ''
    });

    const MAX_IMAGES = 10;
    const MAX_WIDTH = 1280;
    const JPEG_QUALITY = 0.82;
    const SHOE_SIZES = ['35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5', '45', '45.5'];
    const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

    useEffect(() => {
        if (!initialCategories || initialCategories.length === 0) {
            fetchCategories();
        } else {
            setCategories(initialCategories);
        }
    }, [initialCategories]);

    useEffect(() => {
        // Set default category to 'Shoes' if it's a new product and no category is selected
        if (!product && !formData.categoryId && categories.length > 0) {
            const shoesCat = categories.find(c => c.name === 'Shoes');
            if (shoesCat) {
                setFormData(prev => ({ ...prev, categoryId: shoesCat.id }));
            }
        }
    }, [categories, product]);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAll();
            const cats = Array.isArray(res.data) ? res.data : [];
            setCategories(cats);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(file);
            };
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                let { width, height } = img;
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }
                    const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                    resolve(new File([blob], newName, { type: 'image/jpeg' }));
                }, 'image/jpeg', JPEG_QUALITY);
            };
            img.src = objectUrl;
        });
    };

    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files);
        const remaining = MAX_IMAGES - (selectedFiles.length + (product ? product.imageUrls.length : 0));
        
        // Simplified logic: for now let's just use the Dashboard logic but adapted
        const currentCount = previews.length;
        if (currentCount >= MAX_IMAGES) {
            alert(`Tối đa ${MAX_IMAGES} ảnh mỗi sản phẩm.`);
            return;
        }

        const filesToProcess = newFiles.slice(0, MAX_IMAGES - currentCount);
        setCompressing(true);
        try {
            const compressed = await Promise.all(filesToProcess.map(compressImage));
            setSelectedFiles(prev => [...prev, ...compressed]);
            const newPreviews = compressed.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        } finally {
            setCompressing(false);
        }
    };

    const removeFile = (index) => {
        // If it's an existing image (from product.imageUrls), we might need a different handling
        // But for simplicity, we'll just remove from previews and selectedFiles
        // Note: This simple implementation won't remove from server until update.
        setPreviews(prev => prev.filter((_, i) => i !== index));
        
        // If it was a newly selected file, remove it from selectedFiles too
        // This logic is slightly brittle if we mix existing and new, but matches Dashboard.jsx
        // In Dashboard, resetForm clears both.
        const previewUrl = previews[index];
        if (previewUrl.startsWith('blob:')) {
            // Find which index it is in selectedFiles
            // This is complex, but for now let's just filter selectedFiles if it was newly added
            // Actually Dashboard.jsx logic was:
            // setSelectedFiles(prev => prev.filter((_, i) => i !== index));
            // This assumes all previews match selectedFiles. When editing, this breaks.
            // Let's improve it:
            const blobsInPreviewsBefore = previews.slice(0, index).filter(p => p.startsWith('blob:')).length;
            setSelectedFiles(prev => prev.filter((_, i) => i !== blobsInPreviewsBefore));
        }
    };

    const toggleSize = (size) => {
        const currentSizes = formData.size ? formData.size.split(',') : [];
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter(s => s !== size)
            : [...currentSizes, size];
        setFormData({ ...formData, size: newSizes.sort().join(',') });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            const productBlob = new Blob([JSON.stringify({
                ...formData,
                categoryId: formData.categoryId
            })], { type: 'application/json' });

            formDataToSend.append('product', productBlob, 'product.json');
            selectedFiles.forEach(file => {
                formDataToSend.append('images', file, file.name);
            });

            if (product) {
                await productService.update(product.id, formDataToSend);
            } else {
                await productService.create(formDataToSend);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error saving product', error);
            // Lỗi 401/403 đã được xử lý tự động trong api.js (chuyển hướng)
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                alert('Error saving product: ' + (error.response?.data?.error || error.message));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const currentCategory = categories.find(c => c.id == formData.categoryId);

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content !max-w-2xl p-8" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">{product ? t('dashboard.edit_product') : t('dashboard.add_new')}</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
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

                        {(['Shoes', 'Shirt', 'Pants'].includes(currentCategory?.name)) && (
                            <div className="space-y-4 col-span-2 bg-white p-6 rounded-3xl border border-gray-100">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-4">
                                    {t('common.size', { defaultValue: 'Select Sizes' })}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(currentCategory?.name === 'Shoes' ? SHOE_SIZES : CLOTHING_SIZES).map(size => {
                                        const isSelected = formData.size.split(',').includes(size);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`w-12 h-12 rounded-xl text-sm font-bold transition-all border ${isSelected
                                                    ? 'bg-black text-white border-black shadow-lg shadow-black/10 scale-105'
                                                    : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
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
                            {compressing ? (
                                <label className="aspect-square rounded-2xl border-2 border-dashed border-yellow-300 bg-yellow-50 flex flex-col items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-yellow-400/40 border-t-yellow-500 rounded-full animate-spin mb-1" />
                                    <span className="text-[10px] font-bold text-yellow-500">Đang nén...</span>
                                </label>
                            ) : previews.length < MAX_IMAGES ? (
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
                            ) : null}
                        </div>
                        <p className="text-[10px] text-gray-400 italic">Tối đa {MAX_IMAGES} ảnh • ảnh được nén tự động trước khi upload</p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || compressing}
                        className={`w-full bg-black text-white py-5 rounded-3xl font-bold text-lg transition-all shadow-xl shadow-black/10 mt-4 flex items-center justify-center gap-2 ${submitting || compressing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
                            }`}
                    >
                        {submitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{t('common.processing', { defaultValue: 'Processing...' })}</span>
                            </>
                        ) : (
                            product ? t('dashboard.save_changes') : t('dashboard.create_listing')
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
