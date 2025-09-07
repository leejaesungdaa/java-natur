'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import { useVinegarStories } from '@/hooks/useFirebase';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function VinegarStoryAllPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);
    const { stories, loading } = useVinegarStories(locale);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const itemsPerPage = 6;
    
    const filteredStories = useMemo(() => {
        if (selectedCategory === 'all') return stories;
        return stories.filter(story => story.category === selectedCategory);
    }, [stories, selectedCategory]);
    
    const totalPages = Math.ceil(filteredStories.length / itemsPerPage);
    const paginatedStories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStories.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStories, currentPage]);

    // Reset to page 1 when category changes
    useMemo(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8">
                <Link
                    href={`/${locale}/vinegar-story`}
                    className="mb-6 inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>
                        {locale === 'ko' ? '식초 이야기로 돌아가기' :
                         locale === 'en' ? 'Back to Vinegar Story' :
                         locale === 'id' ? 'Kembali ke Cerita Cuka' :
                         locale === 'zh' ? '返回醋的故事' :
                         locale === 'ja' ? '酢の物語に戻る' :
                         locale === 'ar' ? 'العودة إلى قصة الخل' :
                         'Back to Vinegar Story'}
                    </span>
                </Link>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {locale === 'ko' ? '식초 이야기' :
                         locale === 'en' ? 'Vinegar Story' :
                         locale === 'id' ? 'Cerita Cuka' :
                         locale === 'zh' ? '醋的故事' :
                         locale === 'ja' ? '酢の物語' :
                         locale === 'ar' ? 'قصة الخل' :
                         'Vinegar Story'}
                    </h1>
                    <p className="text-gray-600">
                        {locale === 'ko' ? '식초에 대한 다양한 이야기와 정보를 확인하세요' :
                         locale === 'en' ? 'Discover various stories and information about vinegar' :
                         locale === 'id' ? 'Temukan berbagai cerita dan informasi tentang cuka' :
                         locale === 'zh' ? '了解关于醋的各种故事和信息' :
                         locale === 'ja' ? '酢に関する様々な物語と情報をご覧ください' :
                         locale === 'ar' ? 'اكتشف قصصًا ومعلومات متنوعة حول الخل' :
                         'Discover various stories and information about vinegar'}
                    </p>
                </div>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedCategory === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {locale === 'ko' ? '전체' :
                         locale === 'en' ? 'All' :
                         locale === 'id' ? 'Semua' :
                         locale === 'zh' ? '全部' :
                         locale === 'ja' ? 'すべて' :
                         locale === 'ar' ? 'الكل' :
                         'All'}
                    </button>
                    <button
                        onClick={() => setSelectedCategory('health')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedCategory === 'health'
                                ? 'bg-green-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {locale === 'ko' ? '건강' :
                         locale === 'en' ? 'Health' :
                         locale === 'id' ? 'Kesehatan' :
                         locale === 'zh' ? '健康' :
                         locale === 'ja' ? '健康' :
                         locale === 'ar' ? 'الصحة' :
                         'Health'}
                    </button>
                    <button
                        onClick={() => setSelectedCategory('recipe')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedCategory === 'recipe'
                                ? 'bg-green-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {locale === 'ko' ? '레시피' :
                         locale === 'en' ? 'Recipe' :
                         locale === 'id' ? 'Resep' :
                         locale === 'zh' ? '食谱' :
                         locale === 'ja' ? 'レシピ' :
                         locale === 'ar' ? 'وصفة' :
                         'Recipe'}
                    </button>
                    <button
                        onClick={() => setSelectedCategory('history')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedCategory === 'history'
                                ? 'bg-green-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {locale === 'ko' ? '역사' :
                         locale === 'en' ? 'History' :
                         locale === 'id' ? 'Sejarah' :
                         locale === 'zh' ? '历史' :
                         locale === 'ja' ? '歴史' :
                         locale === 'ar' ? 'التاريخ' :
                         'History'}
                    </button>
                    <button
                        onClick={() => setSelectedCategory('tips')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedCategory === 'tips'
                                ? 'bg-green-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {locale === 'ko' ? '활용팁' :
                         locale === 'en' ? 'Tips' :
                         locale === 'id' ? 'Tips' :
                         locale === 'zh' ? '小贴士' :
                         locale === 'ja' ? 'ヒント' :
                         locale === 'ar' ? 'نصائح' :
                         'Tips'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedStories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/${locale}/vinegar-story/${story.id}`} className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                            {story.imageUrl && (
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={story.imageUrl}
                                        alt={story.title}
                                        fill
                                        className="object-cover rounded-t-xl"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    {story.category && (
                                        <span className={`text-xs px-2 py-1 font-medium rounded ${
                                            story.category === 'health' ? 'bg-emerald-100 text-emerald-700' :
                                            story.category === 'recipe' ? 'bg-amber-100 text-amber-700' :
                                            story.category === 'history' ? 'bg-purple-100 text-purple-700' :
                                            story.category === 'tips' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {story.category === 'health' ? (locale === 'ko' ? '건강' : locale === 'en' ? 'Health' : locale === 'id' ? 'Kesehatan' : locale === 'zh' ? '健康' : locale === 'ja' ? '健康' : locale === 'ar' ? 'الصحة' : 'Health') :
                                             story.category === 'recipe' ? (locale === 'ko' ? '레시피' : locale === 'en' ? 'Recipe' : locale === 'id' ? 'Resep' : locale === 'zh' ? '食谱' : locale === 'ja' ? 'レシピ' : locale === 'ar' ? 'وصفة' : 'Recipe') :
                                             story.category === 'history' ? (locale === 'ko' ? '역사' : locale === 'en' ? 'History' : locale === 'id' ? 'Sejarah' : locale === 'zh' ? '历史' : locale === 'ja' ? '歴史' : locale === 'ar' ? 'التاريخ' : 'History') :
                                             story.category === 'tips' ? (locale === 'ko' ? '활용팁' : locale === 'en' ? 'Tips' : locale === 'id' ? 'Tips' : locale === 'zh' ? '小贴士' : locale === 'ja' ? 'ヒント' : locale === 'ar' ? 'نصائح' : 'Tips') :
                                             ''}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {story.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {story.summary}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    {story.createdAt && (
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {story.createdAt}
                                        </span>
                                    )}
                                    <span className="text-green-600 font-medium">
                                        {locale === 'ko' ? '자세히 보기' :
                                         locale === 'en' ? 'Read more' :
                                         locale === 'id' ? 'Baca lebih lanjut' :
                                         locale === 'zh' ? '阅读更多' :
                                         locale === 'ja' ? '続きを読む' :
                                         locale === 'ar' ? 'اقرأ المزيد' :
                                         'Read more'}
                                    </span>
                                </div>
                            </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {stories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {locale === 'ko' ? '등록된 이야기가 없습니다' :
                             locale === 'en' ? 'No stories available' :
                             locale === 'id' ? 'Tidak ada cerita yang tersedia' :
                             locale === 'zh' ? '没有可用的故事' :
                             locale === 'ja' ? '利用可能な物語はありません' :
                             locale === 'ar' ? 'لا توجد قصص متاحة' :
                             'No stories available'}
                        </p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-lg ${
                                        currentPage === page
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}