'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';
import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface Video {
    id: string;
    title: string;
    duration: string;
    thumbnailSrc: string;
    videoUrl?: string;
}

interface VideoGridProps {
    locale: Locale;
    videos: Video[];
    columns?: 1 | 2 | 3 | 4;
}

export default function VideoGrid({
    locale,
    videos,
    columns = 2
}: VideoGridProps) {
    const t = getTranslation(locale);
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const colsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return (
        <>
            <motion.div
                ref={ref}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={staggerContainer()}
                className={`grid grid-cols-1 ${colsClass} gap-8`}
            >
            {videos.map((video, index) => (
                <motion.div
                    key={video.id}
                    custom={index}
                    variants={getAnimationVariant('stagger')}
                    className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                    <div className="relative h-64 w-full overflow-hidden">
                        <Image
                            src={video.thumbnailSrc}
                            alt={video.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {video.videoUrl && getYouTubeId(video.videoUrl) && (
                            <button
                                onClick={() => setSelectedVideo(video)}
                                className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <div className="rounded-full bg-white/90 p-4 text-green-600 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </button>
                        )}
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{video.title}</h3>
                        {video.videoUrl && (
                            <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm mt-4"
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
                </motion.div>
            ))}
            </motion.div>

            {/* Video Modal */}
            {selectedVideo && getYouTubeId(selectedVideo.videoUrl!) && (
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
                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.videoUrl!)}`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}