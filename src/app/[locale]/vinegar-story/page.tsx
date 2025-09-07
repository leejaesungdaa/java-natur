'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Button from '@/components/ui/Button';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import ArticleGrid from '@/components/sections/ArticleGrid';
import VideoGrid from '@/components/sections/VideoGrid';
import CallToAction from '@/components/sections/CallToAction';
import { useVinegarStories, useVinegarVideos, useVinegarProcess } from '@/hooks/useFirebase';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function VinegarStoryPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);
    const { stories, loading: storiesLoading } = useVinegarStories(locale);
    const { videos, loading: videosLoading } = useVinegarVideos(locale);
    const { processes, loading: processLoading } = useVinegarProcess(locale);

    const featuredStories = stories.filter(story => story.isFeatured);
    
    const getCategoryLabel = (category: string) => {
        if (category === 'health') {
            return locale === 'ko' ? '건강' : locale === 'en' ? 'Health' : locale === 'id' ? 'Kesehatan' : locale === 'zh' ? '健康' : locale === 'ja' ? '健康' : locale === 'ar' ? 'الصحة' : 'Health';
        } else if (category === 'recipe') {
            return locale === 'ko' ? '레시피' : locale === 'en' ? 'Recipe' : locale === 'id' ? 'Resep' : locale === 'zh' ? '食谱' : locale === 'ja' ? 'レシピ' : locale === 'ar' ? 'وصفة' : 'Recipe';
        } else if (category === 'history') {
            return locale === 'ko' ? '역사' : locale === 'en' ? 'History' : locale === 'id' ? 'Sejarah' : locale === 'zh' ? '历史' : locale === 'ja' ? '歴史' : locale === 'ar' ? 'التاريخ' : 'History';
        } else if (category === 'tips') {
            return locale === 'ko' ? '활용팁' : locale === 'en' ? 'Tips' : locale === 'id' ? 'Tips' : locale === 'zh' ? '小贴士' : locale === 'ja' ? 'ヒント' : locale === 'ar' ? 'نصائح' : 'Tips';
        }
        return category;
    };

    const vinegarArticles = featuredStories.length > 0 ? featuredStories.map(story => ({
        id: story.id,
        title: story.title,
        excerpt: story.summary,
        imageSrc: story.imageUrl || '/images/vinegar-story/default.jpg',
        date: story.createdAt,
        rawCategory: story.category,
        category: getCategoryLabel(story.category || 'health')
    })) : [
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

    const featuredVideos = videos.filter(video => video.isFeatured);
    
    const vinegarVideos = featuredVideos.length > 0 ? featuredVideos.map(video => ({
        id: video.id,
        title: video.title,
        duration: '',
        thumbnailSrc: video.thumbnailUrl || '/images/vinegar-story/video-default.jpg',
        videoUrl: video.videoUrl
    })) : [
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
                        title={
                            locale === 'ko' ? '식초에 대하여' :
                            locale === 'en' ? 'About Vinegar' :
                            locale === 'id' ? 'Tentang Cuka' :
                            locale === 'zh' ? '关于醋' :
                            locale === 'ja' ? '酢について' :
                            locale === 'ar' ? 'حول الخل' :
                            'About Vinegar'
                        }
                        subtitle={t.vinegarStory.info.subtitle}
                    />

                    {storiesLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <ArticleGrid
                            locale={locale}
                            articles={vinegarArticles}
                            columns={3}
                        />
                    )}

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

                    {videosLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <VideoGrid
                            locale={locale}
                            videos={vinegarVideos}
                            columns={2}
                        />
                    )}

                    <div className="text-center mt-12">
                        <Button
                            href={`/${locale}/vinegar-videos/all`}
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
                            {locale === 'ko' ? '모든 동영상 보기' :
                             locale === 'en' ? 'View All Videos' :
                             locale === 'id' ? 'Lihat Semua Video' :
                             locale === 'zh' ? '查看所有视频' :
                             locale === 'ja' ? 'すべての動画を見る' :
                             locale === 'ar' ? 'عرض جميع الفيديوهات' :
                             'View All Videos'}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Manufacturing Process Section - Clean Design */}
            {processes && processes.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <SectionHeader
                            overline={locale === 'ko' ? '제조과정' :
                                     locale === 'en' ? 'Manufacturing Process' :
                                     locale === 'id' ? 'Proses Pembuatan' :
                                     locale === 'zh' ? '制造过程' :
                                     locale === 'ja' ? '製造過程' :
                                     locale === 'ar' ? 'عملية التصنيع' :
                                     'Manufacturing Process'}
                            title={locale === 'ko' ? '전통과 현대 기술의 만남' :
                                   locale === 'en' ? 'Where Tradition Meets Modern Technology' :
                                   locale === 'id' ? 'Dimana Tradisi Bertemu Teknologi Modern' :
                                   locale === 'zh' ? '传统与现代技术的结合' :
                                   locale === 'ja' ? '伝統と現代技術の出会い' :
                                   locale === 'ar' ? 'حيث تلتقي التقاليد بالتكنولوجيا الحديثة' :
                                   'Where Tradition Meets Modern Technology'}
                            subtitle={locale === 'ko' ? '최고 품질의 식초를 만드는 과정을 소개합니다' :
                                     locale === 'en' ? 'Discover our process of creating the finest quality vinegar' :
                                     locale === 'id' ? 'Temukan proses kami dalam menciptakan cuka berkualitas terbaik' :
                                     locale === 'zh' ? '了解我们创造最优质醋的过程' :
                                     locale === 'ja' ? '最高品質の酢を作る過程をご紹介します' :
                                     locale === 'ar' ? 'اكتشف عمليتنا في صنع أجود أنواع الخل' :
                                     'Discover our process of creating the finest quality vinegar'}
                        />

                        {/* Clean Timeline */}
                        <div className="relative max-w-6xl mx-auto mt-16">
                            {/* Central line - subtle */}
                            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-gray-200 via-green-300 to-gray-200"></div>

                            <div className="space-y-16 lg:space-y-24">
                                {processes.map((process, index) => (
                                    <motion.div
                                        key={process.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ 
                                            duration: 0.6, 
                                            delay: index * 0.1,
                                            ease: "easeOut"
                                        }}
                                        className={`relative flex flex-col lg:flex-row items-center ${
                                            index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                        }`}
                                    >
                                        {/* Content Card - Clean design */}
                                        <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                                    {process.imageUrl && (
                                                        <div className="relative h-56 lg:h-64 overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                                                            <Image
                                                                src={process.imageUrl}
                                                                alt={process.title}
                                                                fill
                                                                className="object-cover transform hover:scale-105 transition-transform duration-500"
                                                            />
                                                            {/* Step badge */}
                                                            <div className="absolute top-4 right-4 z-20">
                                                                <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-md">
                                                                        <span className="text-green-600 font-bold text-sm">
                                                                            {locale === 'ko' ? `${process.step || index + 1}단계` :
                                                                             locale === 'en' ? `Step ${process.step || index + 1}` :
                                                                             locale === 'id' ? `Langkah ${process.step || index + 1}` :
                                                                             locale === 'zh' ? `步骤 ${process.step || index + 1}` :
                                                                             locale === 'ja' ? `ステップ ${process.step || index + 1}` :
                                                                             locale === 'ar' ? `خطوة ${process.step || index + 1}` :
                                                                             `Step ${process.step || index + 1}`}
                                                                        </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="p-6 lg:p-8">
                                                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                                                            {process.title}
                                                        </h3>
                                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                            {process.description}
                                                        </p>
                                                    </div>
                                                </div>
                                        </div>

                                        {/* Timeline Node - Simplified */}
                                        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10">
                                            <motion.div 
                                                className="relative"
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ 
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 15,
                                                    delay: index * 0.05 
                                                }}
                                            >
                                                {/* Outer ring */}
                                                <div className="absolute -inset-1 bg-white rounded-full shadow-lg"></div>
                                                
                                                {/* Inner circle */}
                                                <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                                                    <CheckCircle className="w-6 h-6 text-white" strokeWidth={2} />
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Empty space for alternating layout */}
                                        <div className="hidden lg:block w-5/12"></div>

                                        {/* Mobile timeline indicator */}
                                        <div className="lg:hidden flex items-center justify-center my-6">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                </div>
                                                {index < processes.length - 1 && (
                                                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                                                        <div className="w-0.5 h-8 bg-gradient-to-b from-green-300 to-transparent"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

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