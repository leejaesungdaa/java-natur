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
            id: 'apple-cider-vinegar',
            name: 'Apple Cider Vinegar',
            category: 'cider',
            description: t.products.categories.cider,
            imageSrc: '/images/products/product-1.jpg',
            featured: true,
        },
        {
            id: 'rice-vinegar',
            name: 'Rice Vinegar',
            category: 'rice',
            description: t.products.categories.rice,
            imageSrc: '/images/products/product-2.jpg',
            featured: true,
        },
        {
            id: 'coconut-vinegar',
            name: 'Coconut Vinegar',
            category: 'coconut',
            description: t.products.categories.coconut,
            imageSrc: '/images/products/product-3.jpg',
            featured: true,
        },
        {
            id: 'balsamic-vinegar',
            name: 'Balsamic Vinegar',
            category: 'balsamic',
            description: t.products.categories.balsamic,
            imageSrc: '/images/products/product-4.jpg',
            featured: false,
        },
        {
            id: 'white-vinegar',
            name: 'White Vinegar',
            category: 'white',
            description: t.products.categories.white,
            imageSrc: '/images/products/product-5.jpg',
            featured: false,
        },
        {
            id: 'red-wine-vinegar',
            name: 'Red Wine Vinegar',
            category: 'wine',
            description: t.products.categories.wine,
            imageSrc: '/images/products/product-6.jpg',
            featured: false,
        },
    ];

    const categories = [
        { id: 'all', name: t.products.categories.all },
        { id: 'cider', name: t.products.categories.cider },
        { id: 'rice', name: t.products.categories.rice },
        { id: 'coconut', name: t.products.categories.coconut },
        { id: 'balsamic', name: t.products.categories.balsamic },
        { id: 'wine', name: t.products.categories.wine },
        { id: 'white', name: t.products.categories.white },
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
                        overline="OUR COMMITMENT"
                        title={t.products.productBenefits.title}
                        subtitle={t.products.productBenefits.description}
                    />

                    <FeatureGrid
                        features={qualityFeatures}
                        columns={3}
                        centerTitle={true}
                        iconSize="large"
                    />
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