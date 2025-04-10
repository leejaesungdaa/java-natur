'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import FeatureGrid from '@/components/sections/FeatureGrid';
import ProductGrid from '@/components/sections/ProductGrid';
import CallToAction from '@/components/sections/CallToAction';

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const [aboutRef, aboutVisible] = useAnimation({ threshold: 0.2 });
    const [benefitsRef, benefitsVisible] = useAnimation({ threshold: 0.2 });
    const [testimonialsRef, testimonialsVisible] = useAnimation({ threshold: 0.2 });

    const featuredProducts = [
        {
            id: 'apple-cider-vinegar',
            name: t.products.categories.cider,
            description: t.products.categories.cider,
            imageSrc: '/images/products/product-1.jpg',
        },
        {
            id: 'rice-vinegar',
            name: t.products.categories.rice,
            description: t.products.categories.rice,
            imageSrc: '/images/products/product-2.jpg',
        },
        {
            id: 'coconut-vinegar',
            name: t.products.categories.coconut,
            description: t.products.categories.coconut,
            imageSrc: '/images/products/product-3.jpg',
        }
    ];

    const benefits = [
        {
            icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: t.home.benefits.health.title,
            description: t.home.benefits.health.description
        },
        {
            icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
            ),
            title: t.home.benefits.culinary.title,
            description: t.home.benefits.culinary.description
        },
        {
            icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            title: t.home.benefits.household.title,
            description: t.home.benefits.household.description
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <HeroSection
                locale={locale}
                title={t.home.hero.title}
                subtitle={t.home.hero.subtitle}
                imageSrc="/images/hero-bg.jpg"
                primaryButtonText={t.products.all}
                primaryButtonHref={`/${locale}/products`}
                secondaryButtonText={t.common.buttons.readMore}
                secondaryButtonHref={`/${locale}/company`}
                height="full"
                showScrollIndicator={true}
            />

            {/* About Section */}
            <section ref={aboutRef} className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate={aboutVisible ? "visible" : "hidden"}
                            variants={getAnimationVariant('slideLeft')}
                        >
                            <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">{t.home.about.subtitle}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{t.home.about.title}</h2>
                            <p className="text-lg text-gray-700 mb-10 leading-relaxed">{t.home.about.description}</p>
                            <Button
                                href={`/${locale}/company`}
                                className="px-8 py-3 text-base"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                }
                                iconPosition="right"
                            >
                                {t.common.buttons.readMore}
                            </Button>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate={aboutVisible ? "visible" : "hidden"}
                            variants={getAnimationVariant('slideRight')}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/about-image.jpg"
                                    alt={t.home.about.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={false}
                                />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={aboutVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="absolute -bottom-6 -left-6 bg-green-600 rounded-xl p-6 shadow-xl w-40 h-40 flex items-center justify-center"
                            >
                                <span className="text-white text-center font-bold">{t.products.naturalIngredients}</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product Preview Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.discover}
                        title={t.home.products.title}
                        subtitle={t.home.products.subtitle}
                    />

                    <ProductGrid
                        locale={locale}
                        products={featuredProducts}
                        columns={3}
                    />

                    <div className="text-center mt-16">
                        <Button
                            href={`/${locale}/products`}
                            size="lg"
                            className="px-10 py-4"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            }
                            iconPosition="right"
                        >
                            {t.home.products.viewAll}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section ref={benefitsRef} className="py-24 bg-green-50">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.healthLifestyle}
                        title={t.home.benefits.title}
                        subtitle={t.home.benefits.subtitle}
                    />

                    <FeatureGrid features={benefits} columns={3} />
                </div>
            </section>

            {/* Testimonials Section */}
            <section ref={testimonialsRef} className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.testimonials}
                        title={t.home.testimonials.title}
                        subtitle={t.home.testimonials.subtitle}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {t.home.testimonials.items.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                animate={testimonialsVisible ? "visible" : "hidden"}
                                variants={getAnimationVariant('fadeIn', { delay: 0.2 * (index + 1) })}
                                className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="text-yellow-400 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-6 italic">
                                    "{testimonial.text}"
                                </p>
                                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                <div className="text-gray-500 text-sm">{testimonial.position}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CallToAction
                title={t.home.cta.title}
                subtitle={t.home.cta.subtitle}
                primaryButtonText={t.products.all}
                primaryButtonHref={`/${locale}/products`}
                style="dark"
            />
        </div>
    );
}