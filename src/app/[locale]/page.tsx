'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { useSiteImages, useFeaturedProducts, useHomePageData } from '@/hooks/useFirebase';

const ModernHeroSection = dynamic(() => import('@/components/home/ModernHeroSection'), {
    loading: () => <div className="min-h-screen animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />,
    ssr: false
});

const AboutSection = dynamic(() => import('@/components/home/AboutSection'), {
    loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});

const ProductsSection = dynamic(() => import('@/components/home/ProductsSection'), {
    loading: () => <div className="h-96 animate-pulse bg-white" />
});

const BenefitsSection = dynamic(() => import('@/components/home/BenefitsSection'), {
    loading: () => <div className="h-96 animate-pulse bg-gray-50" />
});

const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'), {
    loading: () => <div className="h-96 animate-pulse bg-white" />
});

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
    loading: () => <div className="h-96 animate-pulse bg-white" />
});

const CTASection = dynamic(() => import('@/components/home/CTASection'), {
    loading: () => <div className="h-64 animate-pulse bg-green-50" />
});

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);
    const { images, loading: imagesLoading } = useSiteImages();
    const { products: featuredProducts, loading: productsLoading } = useFeaturedProducts(locale);
    const { data: homePageData, loading: homePageLoading } = useHomePageData(locale);

    const heroBg = useMemo(() => {
        if (homePageData?.hero?.backgroundImage) return homePageData.hero.backgroundImage;
        return imagesLoading ? "/images/hero-bg.jpg" : (images.heroBg || "/images/hero-bg.jpg");
    }, [homePageData, imagesLoading, images.heroBg]);
    
    const aboutImage = useMemo(() => {
        if (homePageData?.about?.image) return homePageData.about.image;
        return imagesLoading ? "/images/about-image.jpg" : (images.aboutImage || "/images/about-image.jpg");
    }, [homePageData, imagesLoading, images.aboutImage]);

    const heroData = useMemo(() => ({
        title: homePageData?.hero?.title || t.home.hero.title,
        subtitle: homePageData?.hero?.subtitle || t.home.hero.subtitle,
        highlightedText: homePageData?.hero?.highlightedText || t.home.hero.highlightedText
    }), [homePageData, t]);

    const aboutData = useMemo(() => ({
        title: homePageData?.about?.title || t.home.about.title,
        subtitle: homePageData?.about?.subtitle || t.home.about.subtitle,
        whyTitle: homePageData?.about?.whyTitle || t.home.about.whyTitle,
        description: homePageData?.about?.description || t.home.about.description
    }), [homePageData, t]);

    return (
        <div className="w-full">
            <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-200" />}>
                <ModernHeroSection 
                    t={t}
                />
            </Suspense>

            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
                <AboutSection 
                    locale={locale} 
                    aboutImage={aboutImage}
                    aboutData={aboutData}
                />
            </Suspense>

            <Suspense fallback={<div className="h-96 animate-pulse bg-white" />}>
                <ProductsSection locale={locale} products={featuredProducts} loading={productsLoading} />
            </Suspense>

            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-50" />}>
                <BenefitsSection locale={locale} />
            </Suspense>

            <Suspense fallback={<div className="h-96 animate-pulse bg-white" />}>
                <ProcessSection locale={locale} />
            </Suspense>

            <Suspense fallback={<div className="h-96 animate-pulse bg-white" />}>
                <TestimonialsSection locale={locale} />
            </Suspense>

            <Suspense fallback={<div className="h-64 animate-pulse bg-green-50" />}>
                <CTASection locale={locale} />
            </Suspense>
        </div>
    );
}