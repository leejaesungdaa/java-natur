'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import ProductDetail from '@/components/sections/ProductDetail';
import ProductFeatures from '@/components/sections/ProductFeatures';
import ProductBuyOptions from '@/components/sections/ProductBuyOptions';
import ProductGrid from '@/components/sections/ProductGrid';
import CallToAction from '@/components/sections/CallToAction';

interface PageParams {
    locale: Locale;
    productId: string;
}

interface Product {
    id: string;
    name: string;
    tagline: string;
    description: string;
    longDescription: string;
    features: string[];
    benefits: string[];
    images: string[];
    relatedProducts: string[];
}

const products: Record<string, Product> = {
    'apple-cider-vinegar': {
        id: 'apple-cider-vinegar',
        name: 'Natur Java Apple Cider Vinegar',
        tagline: 'With the Mother - Raw & Unfiltered',
        description: 'Our premium Apple Cider Vinegar is made from fresh, organic apples grown in the highlands of Java.',
        longDescription: 'Natur Java Apple Cider Vinegar is crafted using traditional fermentation methods, allowing the natural development of the "mother" - a complex culture of beneficial bacteria that gives our vinegar its distinctive appearance and health properties.',
        features: [
            'Contains the "mother" culture of beneficial bacteria',
            'Made from 100% organic apples',
            'No artificial ingredients or preservatives'
        ],
        benefits: [
            'Supports digestion and gut health',
            'May help regulate blood sugar levels',
            'Contributes to heart health'
        ],
        images: [
            '/images/products/product-1.jpg',
            '/images/products/product-2.jpg',
            '/images/products/product-3.jpg'
        ],
        relatedProducts: ['rice-vinegar', 'coconut-vinegar']
    },
    'rice-vinegar': {
        id: 'rice-vinegar',
        name: 'Natur Java Rice Vinegar',
        tagline: 'Traditional & Pure Rice Fermentation',
        description: 'Our premium Rice Vinegar is crafted through traditional fermentation of organic rice.',
        longDescription: 'Natur Java Rice Vinegar is produced through centuries-old techniques of fermenting organic rice.',
        features: [
            'Made from 100% organic Java rice',
            'No artificial ingredients or preservatives',
            'Naturally gluten-free'
        ],
        benefits: [
            'Gentle acid profile makes it ideal for delicate dishes',
            'Lower acidity than other vinegars',
            'Adds depth to Asian recipes without overpowering'
        ],
        images: [
            '/images/products/product-2.jpg',
            '/images/products/product-1.jpg',
            '/images/products/product-3.jpg'
        ],
        relatedProducts: ['apple-cider-vinegar', 'coconut-vinegar']
    },
    'coconut-vinegar': {
        id: 'coconut-vinegar',
        name: 'Natur Java Coconut Vinegar',
        tagline: 'Traditional Indonesian Fermentation',
        description: 'Our Coconut Vinegar is made from the sap of coconut blossoms.',
        longDescription: 'Natur Java Coconut Vinegar is crafted from fresh coconut tree sap following traditional Indonesian fermentation techniques.',
        features: [
            'Made from 100% fresh coconut blossom sap',
            'Contains 17 amino acids',
            'Rich in vitamins B & C'
        ],
        benefits: [
            'Supports digestive health with natural probiotics',
            'Contains more nutrients than apple cider vinegar',
            'Lower glycemic index than other vinegars'
        ],
        images: [
            '/images/products/product-3.jpg',
            '/images/products/product-1.jpg',
            '/images/products/product-2.jpg'
        ],
        relatedProducts: ['apple-cider-vinegar', 'rice-vinegar']
    }
};

export default function ProductDetailPage({ params }: { params: PageParams }) {
    const { locale, productId } = params;
    const t = getTranslation(locale);

    const product = products[productId];

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
                <Link href={`/${locale}/products`}>
                    <Button>{t.products.all}</Button>
                </Link>
            </div>
        );
    }

    const relatedProductsData = product.relatedProducts.map(id => products[id]);

    const storeOptions = [
        { name: "Official Store", url: "#" },
        { name: "Marketplace 1", url: "#" },
        { name: "Marketplace 2", url: "#" }
    ];

    return (
        <div className="bg-white">
            {/* 제품 소개 섹션 */}
            <div className="pt-16">
                <div className="container mx-auto px-4 py-12">
                    <ProductDetail
                        locale={locale}
                        product={product}
                    />
                </div>
            </div>

            {/* 제품 설명 섹션 */}
            <div className="bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto">
                        <SectionHeader
                            title={`About ${product.name}`}
                            alignment="left"
                        />
                        <p className="text-lg text-gray-700 mb-8">{product.longDescription}</p>

                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{t.products.usage.title}</h3>
                            <p className="text-gray-700">Take 1-2 tablespoons (15-30ml) daily, diluted in water. Can also be used in salad dressings, marinades, and cooking.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 특징 및 효능 섹션 */}
            <div id="features" className="bg-white">
                <div className="container mx-auto px-4 py-16">
                    <ProductFeatures
                        locale={locale}
                        features={product.features}
                        benefits={product.benefits}
                    />
                </div>
            </div>

            {/* 구매 섹션 */}
            <div id="buy" className="bg-green-50">
                <div className="container mx-auto px-4 py-16">
                    <SectionHeader
                        title={t.products.where.title}
                        subtitle={t.products.where.description}
                    />

                    <ProductBuyOptions
                        locale={locale}
                        stores={storeOptions}
                    />
                </div>
            </div>

            {/* 관련 제품 섹션 */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">
                    <SectionHeader
                        title={t.products.relatedProducts}
                        subtitle="Explore more premium vinegar products from the Natur Java collection."
                    />

                    <ProductGrid
                        locale={locale}
                        products={relatedProductsData.map(p => ({
                            id: p.id,
                            name: p.name,
                            description: p.description,
                            imageSrc: p.images[0]
                        }))}
                        columns={3}
                    />
                </div>
            </div>

            {/* CTA 섹션 */}
            <CallToAction
                title="Want to Learn More About Vinegar Benefits?"
                subtitle="Discover the countless health benefits and culinary uses of our premium vinegar products."
                primaryButtonText="Explore Vinegar Story"
                primaryButtonHref={`/${locale}/vinegar-story`}
                style="dark"
            />
        </div>
    );
}