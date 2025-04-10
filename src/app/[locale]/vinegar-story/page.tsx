'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import ArticleGrid from '@/components/sections/ArticleGrid';
import VideoGrid from '@/components/sections/VideoGrid';
import CallToAction from '@/components/sections/CallToAction';

export default function VinegarStoryPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const [featuredRef, featuredInView] = useAnimation({ threshold: 0.2 });

    const vinegarArticles = [
        {
            id: 'health-benefits',
            title: 'Health Benefits of Vinegar',
            excerpt: 'Discover the numerous health benefits that natural vinegar can provide to your daily routine.',
            imageSrc: '/images/vinegar-story/health-benefits.jpg',
            date: '2023-12-10',
            category: t.vinegarStory.articles.category.health
        },
        {
            id: 'culinary-uses',
            title: 'Culinary Uses of Vinegar',
            excerpt: 'From salad dressings to marinades, learn how to utilize vinegar in your cooking.',
            imageSrc: '/images/vinegar-story/culinary-uses.jpg',
            date: '2023-11-25',
            category: t.vinegarStory.articles.category.culinary
        },
        {
            id: 'production-process',
            title: 'How Vinegar is Made',
            excerpt: 'An in-depth look at the traditional and modern vinegar production processes.',
            imageSrc: '/images/vinegar-story/production-process.jpg',
            date: '2023-11-15',
            category: t.vinegarStory.articles.category.household
        },
        {
            id: 'types-of-vinegar',
            title: 'Types of Vinegar Around the World',
            excerpt: 'Explore different varieties of vinegar from various cultures and regions.',
            imageSrc: '/images/vinegar-story/types-of-vinegar.jpg',
            date: '2023-10-30',
            category: t.vinegarStory.articles.category.culinary
        },
        {
            id: 'vinegar-history',
            title: 'The Ancient History of Vinegar',
            excerpt: 'Tracing the origins and historical significance of vinegar throughout human civilization.',
            imageSrc: '/images/vinegar-story/vinegar-history.jpg',
            date: '2023-10-15',
            category: t.vinegarStory.articles.category.health
        },
        {
            id: 'vinegar-in-home',
            title: 'Household Uses for Vinegar',
            excerpt: 'Beyond the kitchen: how vinegar can be used for cleaning, gardening, and more.',
            imageSrc: '/images/vinegar-story/vinegar-in-home.jpg',
            date: '2023-09-28',
            category: t.vinegarStory.articles.category.household
        }
    ];

    const vinegarVideos = [
        {
            id: 'video-1',
            title: 'The Health Benefits of Apple Cider Vinegar',
            duration: '05:32',
            thumbnailSrc: '/images/vinegar-story/video-thumbnail-1.jpg',
        },
        {
            id: 'video-2',
            title: 'How to Make Vinegar at Home',
            duration: '08:45',
            thumbnailSrc: '/images/vinegar-story/video-thumbnail-2.jpg',
        },
        {
            id: 'video-3',
            title: 'Vinegar Uses in Traditional Cooking',
            duration: '06:18',
            thumbnailSrc: '/images/vinegar-story/video-thumbnail-3.jpg',
        },
        {
            id: 'video-4',
            title: 'The Science Behind Fermentation',
            duration: '10:22',
            thumbnailSrc: '/images/vinegar-story/video-thumbnail-4.jpg',
        }
    ];

    return (
        <div className="w-full pt-16">
            {/* Hero Section */}
            <HeroSection
                locale={locale}
                title={t.vinegarStory.info.title}
                subtitle={t.vinegarStory.info.description}
                imageSrc="/images/vinegar-story/hero-bg.jpg"
                height="medium"
            />

            {/* Information Section */}
            <section id="info" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.knowledge}
                        title={t.vinegarStory.info.title}
                        subtitle={t.vinegarStory.info.subtitle}
                    />

                    <ArticleGrid
                        locale={locale}
                        articles={vinegarArticles}
                        columns={3}
                    />

                    <div className="text-center mt-12">
                        <Button
                            href={`/${locale}/vinegar-story/all`}
                            variant="outline"
                            size="lg"
                            className="px-8 py-3"
                            icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            }
                            iconPosition="right"
                        >
                            {t.vinegarStory.articles.viewAll}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Videos Section */}
            <section id="videos" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.watchLearn}
                        title={t.vinegarStory.videos.title}
                        subtitle={t.vinegarStory.videos.subtitle}
                    />

                    <VideoGrid
                        locale={locale}
                        videos={vinegarVideos}
                        columns={2}
                    />

                    <div className="text-center mt-12">
                        <Button
                            href={`/${locale}/vinegar-story/videos`}
                            variant="outline"
                            size="lg"
                            className="px-8 py-3"
                            icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            }
                            iconPosition="right"
                        >
                            {t.vinegarStory.articles.viewAll}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Content Section */}
            <section className="py-24 bg-white" ref={featuredRef}>
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.featured}
                        title={t.vinegarStory.production.title}
                        subtitle={t.vinegarStory.production.subtitle}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <motion.div
                            initial="hidden"
                            animate={featuredInView ? "visible" : "hidden"}
                            variants={getAnimationVariant('slideLeft')}
                            className="lg:col-span-2"
                        >
                            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                                <Image
                                    src="/images/vinegar-story/production-feature.jpg"
                                    alt={t.vinegarStory.production.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            animate={featuredInView ? "visible" : "hidden"}
                            variants={getAnimationVariant('slideRight')}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="bg-gray-50 p-8 rounded-xl h-full">
                                <span className="text-green-600 font-semibold">{t.common.sections.craftsmanship}</span>
                                <h3 className="text-2xl font-bold text-gray-900 my-4">{t.vinegarStory.production.subtitle}</h3>
                                <p className="text-gray-600 mb-6">
                                    {t.vinegarStory.production.description}
                                </p>
                                <Button
                                    href={`/${locale}/vinegar-story/production-process`}
                                    className="w-full justify-center"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    }
                                    iconPosition="right"
                                >
                                    {t.common.buttons.learnMore}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <CallToAction
                title={t.vinegarStory.cta.title}
                subtitle={t.vinegarStory.cta.description}
                primaryButtonText={t.products.all}
                primaryButtonHref={`/${locale}/products`}
                style="dark"
            />
        </div>
    );
}