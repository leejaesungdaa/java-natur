'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import { useVinegarVideos } from '@/hooks/useFirebase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, PlayCircle, ChevronLeft, ChevronRight, ArrowLeft, ExternalLink, X } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function VinegarVideosAllPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);
    const { videos, loading } = useVinegarVideos(locale);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const itemsPerPage = 6;

    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };
    
    const totalPages = Math.ceil(videos.length / itemsPerPage);
    const paginatedVideos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return videos.slice(startIndex, startIndex + itemsPerPage);
    }, [videos, currentPage]);

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
                        {locale === 'ko' ? '식초 동영상' :
                         locale === 'en' ? 'Vinegar Videos' :
                         locale === 'id' ? 'Video Cuka' :
                         locale === 'zh' ? '醋视频' :
                         locale === 'ja' ? '酢の動画' :
                         locale === 'ar' ? 'فيديوهات الخل' :
                         'Vinegar Videos'}
                    </h1>
                    <p className="text-gray-600">
                        {locale === 'ko' ? '식초 제조과정과 관련 동영상을 확인하세요' :
                         locale === 'en' ? 'Watch videos about vinegar production process' :
                         locale === 'id' ? 'Tonton video tentang proses produksi cuka' :
                         locale === 'zh' ? '观看关于醋生产过程的视频' :
                         locale === 'ja' ? '酢の製造過程に関する動画をご覧ください' :
                         locale === 'ar' ? 'شاهد مقاطع فيديو حول عملية إنتاج الخل' :
                         'Watch videos about vinegar production process'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedVideos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                                <div className="relative">
                                    {video.thumbnailUrl ? (
                                        <div className="relative aspect-video rounded-t-xl overflow-hidden">
                                            <img
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {getYouTubeId(video.videoUrl) && (
                                                <button
                                                    onClick={() => setSelectedVideo(video)}
                                                    className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center group"
                                                >
                                                    <PlayCircle size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gray-200 rounded-t-xl flex items-center justify-center">
                                            <PlayCircle size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {video.description}
                                    </p>
                                    <div className="flex items-center justify-between mb-4">
                                        {video.createdAt && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar size={14} />
                                                {video.createdAt}
                                            </span>
                                        )}
                                    </div>
                                    {video.videoUrl && (
                                        <a
                                            href={video.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                                        >
                                            <ExternalLink size={16} />
                                            {locale === 'ko' ? '동영상 보기' :
                                             locale === 'en' ? 'Watch Video' :
                                             locale === 'id' ? 'Tonton Video' :
                                             locale === 'zh' ? '观看视频' :
                                             locale === 'ja' ? '動画を見る' :
                                             locale === 'ar' ? 'شاهد الفيديو' :
                                             'Watch Video'}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {videos.length === 0 && (
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

            {/* Video Modal */}
            {selectedVideo && getYouTubeId(selectedVideo.videoUrl) && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.videoUrl)}`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}