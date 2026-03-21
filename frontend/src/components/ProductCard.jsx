import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { t, i18n } = useTranslation();

    return (
        <Link
            to={`/product/${product.id}`}
            className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-gray-50 flex flex-col h-full"
        >
            <div className={`aspect-[4/5] relative overflow-hidden bg-gray-100 rounded-2xl ${product.status === 'SOLD' ? 'grayscale opacity-75' : ''}`}>
                <img
                    src={product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1594411133999-119c631405fc?w=500&q=80'}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {product.status === 'SOLD' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
                        <span className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                            {t('common.sold', { defaultValue: 'SOLD' })}
                        </span>
                    </div>
                )}
                {product.conditionStatus && product.status !== 'SOLD' && (
                    <span className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm shadow-sm rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-black">
                        {t(`conditions.${product.conditionStatus}`, { defaultValue: product.conditionStatus.replace('_', ' ') })}
                    </span>
                )}
            </div>

            <div className="pt-4 pb-2 px-1 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className={`font-bold text-sm tracking-wide line-clamp-2 leading-snug ${product.status === 'SOLD' ? 'text-gray-400 line-through' : 'text-black'}`}>
                        {product.title}
                    </h3>
                </div>
                <p className="text-xs font-light text-gray-500 mb-2 truncate uppercase tracking-wider mt-1">
                    {t(`categories.${product.categoryName}`, { defaultValue: product.categoryName || 'General' })}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className={`text-base font-bold tracking-tight ${product.status === 'SOLD' ? 'text-gray-400' : 'text-black'}`}>
                        {formatPrice(product.price, i18n.language)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
