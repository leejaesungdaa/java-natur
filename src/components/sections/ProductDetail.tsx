'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailProps {
    locale: Locale;
    product: {
        id: string;
        name: string;
        tagline: string;
        description: string;
        longDescription: string;
        features: string[];
        benefits: string[];
        images: string[];
    };
}

export default function ProductDetail({
    locale,
    product
}: ProductDetailProps) {
    const t = getTranslation(locale);
    const [activeImage, setActiveImage] = useState(0);
    const [imageLoadError, setImageLoadError] = useState<boolean[]>([]);

    const handleImageError = (index: number) => {
        const newErrors = [...imageLoadError];
        newErrors[index] = true;
        setImageLoadError(newErrors);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-square relative rounded-xl overflow-hidden shadow-lg mb-6"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full"
                        >
                            <Image
                                src={product.images[activeImage] || '/images/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                onError={() => handleImageError(activeImage)}
                            />
                            {imageLoadError[activeImage] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <p className="text-gray-500">이미지를 불러올 수 없습니다</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                <div className="flex gap-4 justify-center">
                    {product.images.map((image: string, index: number) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveImage(index)}
                            className={`w-20 h-20 rounded-md overflow-hidden relative ${activeImage === index
                                ? 'ring-2 ring-green-600 ring-offset-2'
                                : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={image || '/images/placeholder.jpg'}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                onError={() => handleImageError(index)}
                            />
                            {imageLoadError[index] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <p className="text-gray-500 text-xs">이미지 오류</p>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div>
                <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="text-green-600 font-semibold mb-2 block">NATUR JAVA</span>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-xl text-gray-600 mb-6">{product.tagline}</p>

                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <p className="text-gray-700 mb-6">{product.description}</p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <Button
                                    href="#buy"
                                    size="lg"
                                    className="px-8"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    }
                                >
                                    {t.common.buttons.buyNow}
                                </Button>

                                <Button
                                    href="#features"
                                    variant="outline"
                                    size="lg"
                                    className="px-8"
                                >
                                    {t.common.buttons.learnMore}
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{t.home.features.natural}</span>
                                </div>

                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{t.home.features.noPreservatives}</span>
                                </div>

                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{t.home.features.traditional}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}