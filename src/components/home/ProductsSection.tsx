'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useAnimation } from '@/hooks/useAnimation';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { Product } from '@/types';
import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';

interface ProductsSectionProps {
    locale: Locale;
    products: any[];
    loading: boolean;
}

export default function ProductsSection({ locale, products, loading }: ProductsSectionProps) {
    const t = getTranslation(locale);
    const [productsRef, productsVisible] = useAnimation({ threshold: 0.2 });
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    return (
        <section ref={productsRef} className="py-24">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={productsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">
                        {t.common.sections.discover}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        {t.home.products.title}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {t.home.products.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {loading ? (
                        Array(3).fill(0).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={productsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                                className="bg-gray-100 rounded-xl h-64 animate-pulse"
                            />
                        ))
                    ) : (
                        products.slice(0, 3).map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={productsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                                className="bg-white rounded-xl shadow-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={product.imageSrc}
                                        alt={product.name}
                                        fill
                                        priority={index === 0}
                                        className="object-contain transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        {product.name}
                                    </h3>
                                    {product.featured && (
                                        <div className="absolute top-2 right-2">
                                            <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">
                                                BEST
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={20} />
                                        {t.common.buttons.buyNow}
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={productsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <Button href={`/${locale}/products`} size="lg" className="px-10 py-4">
                        {t.home.products.viewAll}
                    </Button>
                </motion.div>
            </div>

            {/* Purchase Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg p-6 max-w-md w-full"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {locale === 'ko' ? '구매 채널 선택' :
                                 locale === 'id' ? 'Pilih Saluran Pembelian' :
                                 locale === 'zh' ? '选择购买渠道' :
                                 locale === 'ja' ? '購入チャネルを選択' :
                                 locale === 'ar' ? 'اختر قناة الشراء' :
                                 'Select Purchase Channel'}
                            </h3>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            {selectedProduct.name}
                        </p>
                        
                        <div className="space-y-3">
                            {selectedProduct.shopeeLink && (
                                <a
                                    href={selectedProduct.shopeeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-center"
                                >
                                    Shopee
                                </a>
                            )}
                            
                            {selectedProduct.tokopediaLink && (
                                <a
                                    href={selectedProduct.tokopediaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-center"
                                >
                                    Tokopedia
                                </a>
                            )}
                            
                            {!selectedProduct.shopeeLink && !selectedProduct.tokopediaLink && (
                                <p className="text-gray-500 text-center py-4">
                                    {locale === 'ko' ? '구매 링크가 없습니다' :
                                     locale === 'id' ? 'Tautan pembelian tidak tersedia' :
                                     locale === 'zh' ? '暂无购买链接' :
                                     locale === 'ja' ? '購入リンクはありません' :
                                     locale === 'ar' ? 'رابط الشراء غير متوفر' :
                                     'Purchase links not available'}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
}