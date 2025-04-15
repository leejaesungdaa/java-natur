'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import ProductGrid from '@/components/sections/ProductGrid';
import CategoryFilter from '@/components/sections/CategoryFilter';
import FeatureGrid from '@/components/sections/FeatureGrid';
import CallToAction from '@/components/sections/CallToAction';

export default function ProductsPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);
    const [activeCategory, setActiveCategory] = useState('all');

    const [featuredRef, featuredVisible] = useAnimation({ threshold: 0.2 });
    const [allProductsRef, allProductsVisible] = useAnimation({ threshold: 0.2 });

    const products = [
        {
            id: 'sugarcane-pineapple',
            name: '사탕수수 파인애플 식초',
            category: 'pineapple',
            description: '사탕수수 80%\n파인애플 20%',
            imageSrc: '/images/products/product-1.jpg',
            featured: true,
        },
        {
            id: 'sugarcane-apple',
            name: '사탕수수 사과 식초',
            category: 'apple',
            description: '사탕수수 80%\n사과 20%',
            imageSrc: '/images/products/product-2.jpg',
            featured: true,
        },
        {
            id: 'sugarcane-dragonfruit',
            name: '사탕수수 용과 식초',
            category: 'dragonFruit',
            description: '사탕수수 80%\n용과 20%',
            imageSrc: '/images/products/product-3.jpg',
            featured: true,
        },
        {
            id: 'sugarcane-noni',
            name: '사탕수수 노니 식초',
            category: 'noni',
            description: '사탕수수 80%\n노니 20%\n(출시 예정)',
            imageSrc: '/images/products/product-4.jpg',
            featured: false,
        }
    ];

    const categories = [
        { id: 'all', name: t.products.categories.all },
        { id: 'pineapple', name: t.products.categories.pineapple },
        { id: 'apple', name: t.products.categories.apple },
        { id: 'dragonFruit', name: t.products.categories.dragonFruit },
        { id: 'noni', name: t.products.categories.noni },
    ];

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(product => product.category === activeCategory);

    const featuredProducts = products.filter(product => product.featured);

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
            {/* Hero Section */}
            <HeroSection
                locale={locale}
                title={t.products.all}
                subtitle={t.products.productBenefits.description}
                imageSrc="/images/products/products-hero.jpg"
                height="medium"
            />

            {/* Featured Products Section */}
            <section ref={featuredRef} className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.products.featured}
                        title={t.home.products.featuredProducts}
                        subtitle={t.home.products.subtitle}
                    />

                    <ProductGrid
                        locale={locale}
                        products={featuredProducts}
                        columns={3}
                    />
                </div>
            </section>

            {/* All Products Section */}
            <section ref={allProductsRef} className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline="CATALOG"
                        title={t.products.all}
                        subtitle={t.products.usage.description}
                    />

                    {/* Category Filter */}
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onChange={setActiveCategory}
                    />

                    <ProductGrid
                        locale={locale}
                        products={filteredProducts}
                        columns={3}
                        showCategory={true}
                    />
                </div>
            </section>

            {/* Product Quality Section */}
            <section className="py-24 bg-white">
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

            {/* Call to Action */}
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