'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import { ShoppingCart, X, Star } from 'lucide-react';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import FeatureGrid from '@/components/sections/FeatureGrid';
import CallToAction from '@/components/sections/CallToAction';
import { useProducts, useSiteImages } from '@/hooks/useFirebase';
import { Product } from '@/types';

export default function ProductsPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);
    const router = useRouter();
    const { products: rawProducts, loading: productsLoading } = useProducts(locale);
    const { images, loading: imagesLoading } = useSiteImages();

    const [allProductsRef, allProductsVisible] = useAnimation({ threshold: 0.2 });

    const heroBg = imagesLoading ? "/images/products/products-hero.jpg" : (images.productsHeroBg || "/images/products/products-hero.jpg");

    const products: Product[] = rawProducts.map(p => ({
        id: p.id,
        name: p.name || '',
        category: p.category || '',
        description: p.description || '',
        imageSrc: p.imageUrl || p.imageSrc || '',
        featured: p.featured || false,
        order: p.order || 999
    }));

    // Sort products: featured first, then by order
    const sortedProducts = [...products].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 999) - (b.order || 999);
    });

    const qualityFeatures = [
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ),
            title: t.products.quality.title,
            description: t.products.quality.description
        },
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ),
            title: t.products.traditional.title,
            description: t.products.traditional.description
        },
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ),
            title: t.products.local.title,
            description: t.products.local.description
        }
    ];

    return (
        <div className="w-full pt-16">
            <HeroSection
                locale={locale}
                title={t.products.all}
                subtitle={t.products.productBenefits.description}
                imageSrc={heroBg}
                height="medium"
            />

            <section ref={allProductsRef} className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline="CATALOG"
                        title={t.products.all}
                        subtitle={t.products.usage.description}
                    />

                    {productsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Array(6).fill(0).map((_, index) => (
                                <div key={index} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {sortedProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <div className="relative h-64 w-full overflow-hidden bg-gray-50">
                                        {product.imageSrc ? (
                                            <img
                                                src={product.imageSrc}
                                                alt={product.name}
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400">No image</span>
                                            </div>
                                        )}
                                        {product.featured && (
                                            <div className="absolute top-2 right-2">
                                                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-xs font-bold">BEST</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-200">
                                            {product.name}
                                        </h3>
                                        <button
                                            onClick={() => router.push(`/${locale}/products/${product.id}`)}
                                            className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={20} />
                                            {t.common.buttons.buyNow}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.healthLifestyle}
                        title={t.products.productBenefits.title}
                        subtitle={t.products.productBenefits.description}
                    />

                    <FeatureGrid
                        features={qualityFeatures}
                        columns={3}
                        centerTitle={true}
                        iconSize="large"
                    />

                    <div className="mt-12 text-center">
                        <Button
                            href={`/${locale}/vinegar-story#videos`}
                            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white"
                            size="lg"
                            icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        >
                            {t.common.buttons.watchVideoCheck}
                        </Button>
                    </div>
                </div>
            </section>

            <CallToAction
                title={t.home.cta.title}
                subtitle={t.home.cta.subtitle}
                primaryButtonText={t.common.buttons.contactUs}
                primaryButtonHref={`/${locale}/support`}
                secondaryButtonText={t.common.buttons.learnMore}
                secondaryButtonHref={`/${locale}/vinegar-story`}
                style="dark"
            />
        </div>
    );
}