'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronLeft, Star, Shield, Truck, Clock } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';

interface Product {
    id: string;
    name_ko?: string;
    name_en?: string;
    name_id?: string;
    name_zh?: string;
    name_ja?: string;
    name_ar?: string;
    description_ko?: string;
    description_en?: string;
    description_id?: string;
    description_zh?: string;
    description_ja?: string;
    description_ar?: string;
    imageUrl?: string;
    shopeeLink?: string;
    tokopediaLink?: string;
    featured?: boolean;
}

export default function ProductDetailPage({ 
    params: { locale, productId } 
}: { 
    params: { locale: Locale, productId: string } 
}) {
    const t = getTranslation(locale);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        loadProduct();
    }, [productId, locale]);

    const loadProduct = async () => {
        try {
            const docRef = doc(db, 'products', productId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
            } else {
                router.push(`/${locale}/products`);
            }
        } catch (error) {
            console.error('Error loading product:', error);
            router.push(`/${locale}/products`);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedField = (field: string): string => {
        if (!product) return '';
        const fieldKey = `${field}_${locale}` as keyof Product;
        const value = product[fieldKey] || product[`${field}_en` as keyof Product] || '';
        return typeof value === 'string' ? value : '';
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const features = [
        {
            icon: <Shield className="w-5 h-5" />,
            title: locale === 'ko' ? '100% 천연' : locale === 'id' ? '100% Alami' : '100% Natural',
            subtitle: locale === 'ko' ? '천연 발효 공정' : locale === 'id' ? 'Proses fermentasi alami' : 'Natural fermentation process'
        },
        {
            icon: <Truck className="w-5 h-5" />,
            title: locale === 'ko' ? '안전한 배송' : locale === 'id' ? 'Pengiriman Aman' : 'Safe Delivery',
            subtitle: locale === 'ko' ? '안전하게 포장하여 배송' : locale === 'id' ? 'Dikemas dengan aman' : 'Safely packaged delivery'
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: locale === 'ko' ? '365일 상담' : locale === 'id' ? 'Konsultasi 365 Hari' : '365 Days Support',
            subtitle: locale === 'ko' ? '언제든 문의 가능' : locale === 'id' ? 'Hubungi kapan saja' : 'Contact anytime'
        }
    ];

    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <button 
                            onClick={() => router.push(`/${locale}/products`)}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <ChevronLeft size={16} />
                            {t.products.all}
                        </button>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{getLocalizedField('name')}</span>
                    </div>
                </div>
            </div>

            {/* Product Detail */}
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Gallery */}
                        <div className="p-8 lg:p-12 bg-gray-50">
                            <div className="relative">
                                {product.featured && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-bold text-sm">BEST SELLER</span>
                                        </div>
                                    </div>
                                )}
                                <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-inner">
                                    <img
                                        src={product.imageUrl || '/images/placeholder.jpg'}
                                        alt={getLocalizedField('name') || ''}
                                        className="w-full h-full object-contain p-8"
                                    />
                                </div>
                                
                                {/* Features - Under Image */}
                                <div className="grid grid-cols-3 gap-3 mt-6">
                                    {features.map((feature, index) => (
                                        <div key={index} className="text-center p-3 bg-white rounded-lg border border-gray-100">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mx-auto mb-2">
                                                {feature.icon}
                                            </div>
                                            <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                                            <p className="text-xs text-gray-600 mt-1">{feature.subtitle}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-8 lg:p-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Product Name */}
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                    {getLocalizedField('name')}
                                </h1>

                                {/* Purchase Options - Moved Up */}
                                <div className="space-y-4 mb-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {locale === 'ko' ? '구매 옵션' : 
                                         locale === 'id' ? 'Opsi Pembelian' : 
                                         'Purchase Options'}
                                    </h3>
                                    
                                    {product.shopeeLink && (
                                        <a
                                            href={product.shopeeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full p-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] shadow-lg"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                                        <ShoppingCart className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-lg">Shopee</p>
                                                        <p className="text-sm text-white/90">
                                                            {locale === 'ko' ? '공식 스토어' : 
                                                             locale === 'id' ? 'Toko Resmi' : 
                                                             'Official Store'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur rounded-lg">
                                                    <span className="text-white font-bold">
                                                        {locale === 'ko' ? '구매하기' : 
                                                         locale === 'id' ? 'Beli Sekarang' : 
                                                         'Buy Now'}
                                                    </span>
                                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </a>
                                    )}

                                    {product.tokopediaLink && (
                                        <a
                                            href={product.tokopediaLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full p-5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                                        <ShoppingCart className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-lg">Tokopedia</p>
                                                        <p className="text-sm text-white/90">
                                                            {locale === 'ko' ? '공식 스토어' : 
                                                             locale === 'id' ? 'Toko Resmi' : 
                                                             'Official Store'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur rounded-lg">
                                                    <span className="text-white font-bold">
                                                        {locale === 'ko' ? '구매하기' : 
                                                         locale === 'id' ? 'Beli Sekarang' : 
                                                         'Buy Now'}
                                                    </span>
                                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </a>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="prose prose-lg">
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {getLocalizedField('description')}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}