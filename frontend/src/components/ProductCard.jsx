import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';

const ProductCard = ({ product, onClick }) => {
    const { t, i18n } = useTranslation();

    return (
        <div
            onClick={() => onClick(product)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden card-hover border border-gray-50"
        >
            <div className={`aspect-[3/4] relative overflow-hidden bg-gray-100 ${product.status === 'SOLD' ? 'grayscale' : ''}`}>
                <img
                    src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1594411133999-119c631405fc?w=500&q=80'}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.status === 'SOLD' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                            {t('common.sold', { defaultValue: 'SOLD' })}
                        </span>
                    </div>
                )}
                {product.conditionStatus && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-700">
                        {t(`conditions.${product.conditionStatus}`, { defaultValue: product.conditionStatus.replace('_', ' ') })}
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-gray-900 line-clamp-1 ${product.status === 'SOLD' ? 'text-gray-400' : ''}`}>{product.title}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-2 truncate">
                    {t(`categories.${product.categoryName}`, { defaultValue: product.categoryName || 'General' })}
                </p>
                <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${product.status === 'SOLD' ? 'text-gray-300 line-through' : 'text-black'}`}>{formatPrice(product.price, i18n.language)}</span>
                    {product.status === 'SOLD' && (
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase">
                            {t('common.sold', { defaultValue: 'SOLD' })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
