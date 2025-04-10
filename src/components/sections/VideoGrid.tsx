'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';

interface Video {
    id: string;
    title: string;
    duration: string;
    thumbnailSrc: string;
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

    const colsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return (
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
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="rounded-full bg-white/90 p-4 text-green-600 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{video.title}</h3>
                        <Button
                            href={`/${locale}/vinegar-story/videos/${video.id}`}
                            variant="primary"
                            size="sm"
                            className="w-full justify-center mt-4"
                            icon={
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        >
                            {t.common.buttons.watchVideo}
                        </Button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}