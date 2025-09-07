'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { homePageService } from '@/lib/firebase/services';

export default function VinegarVideosPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);
    const [videos, setVideos] = useState<any[]>([]);
    const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVideos = async () => {
            try {
                const data = await homePageService.getVinegarVideos(locale);
                const featured = data.filter((v: any) => v.isFeatured);
                const regular = data.filter((v: any) => !v.isFeatured);
                
                setFeaturedVideos(featured);
                setVideos(regular);
            } catch (error) {
                console.error('Error loading videos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadVideos();
    }, [locale]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredVideos.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {featuredVideos.length > 0 && (
                <div className="relative bg-green-800 text-white py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            {locale === 'ko' ? '주요 동영상' :
                             locale === 'en' ? 'Featured Videos' :
                             locale === 'id' ? 'Video Unggulan' :
                             locale === 'zh' ? '精选视频' :
                             locale === 'ja' ? '注目の動画' :
                             locale === 'ar' ? 'مقاطع الفيديو المميزة' :
                             'Featured Videos'}
                        </h2>
                        
                        <div className="relative max-w-4xl mx-auto">
                            <Link 
                                href={`/${locale}/vinegar-videos/${featuredVideos[currentIndex].id}`}
                                className="block"
                            >
                                <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                                    {featuredVideos[currentIndex].thumbnailUrl ? (
                                        <div className="relative aspect-video">
                                            <img
                                                src={featuredVideos[currentIndex].thumbnailUrl}
                                                alt={featuredVideos[currentIndex].title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-40 transition-all">
                                                <PlayCircle size={64} className="text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                            <PlayCircle size={64} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="p-6 text-gray-900">
                                        <h3 className="text-2xl font-bold mb-2">
                                            {featuredVideos[currentIndex].title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {featuredVideos[currentIndex].description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            
                            {featuredVideos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute top-1/2 -left-12 transform -translate-y-1/2 bg-white text-green-800 rounded-full p-2 shadow-lg hover:bg-gray-100"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white text-green-800 rounded-full p-2 shadow-lg hover:bg-gray-100"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                    
                                    <div className="flex justify-center mt-4 gap-2">
                                        {featuredVideos.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    currentIndex === index ? 'bg-white w-8' : 'bg-white/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {locale === 'ko' ? '모든 동영상' :
                         locale === 'en' ? 'All Videos' :
                         locale === 'id' ? 'Semua Video' :
                         locale === 'zh' ? '所有视频' :
                         locale === 'ja' ? 'すべての動画' :
                         locale === 'ar' ? 'جميع مقاطع الفيديو' :
                         'All Videos'}
                    </h1>
                    <Link
                        href={`/${locale}/vinegar-videos/all`}
                        className="text-green-600 hover:text-green-700 font-medium"
                    >
                        {locale === 'ko' ? '전체 보기' :
                         locale === 'en' ? 'View All' :
                         locale === 'id' ? 'Lihat Semua' :
                         locale === 'zh' ? '查看全部' :
                         locale === 'ja' ? 'すべて見る' :
                         locale === 'ar' ? 'عرض الكل' :
                         'View All'}
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.slice(0, 6).map((video) => (
                        <Link
                            key={video.id}
                            href={`/${locale}/vinegar-videos/${video.id}`}
                            className="group"
                        >
                            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                                {video.thumbnailUrl ? (
                                    <div className="relative aspect-video">
                                        <img
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                            <PlayCircle size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                        <PlayCircle size={48} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {video.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {videos.length === 0 && featuredVideos.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {locale === 'ko' ? '등록된 동영상이 없습니다' :
                             locale === 'en' ? 'No videos available' :
                             locale === 'id' ? 'Tidak ada video yang tersedia' :
                             locale === 'zh' ? '没有可用的视频' :
                             locale === 'ja' ? '利用可能な動画はありません' :
                             locale === 'ar' ? 'لا توجد مقاطع فيديو متاحة' :
                             'No videos available'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}