'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import Link from 'next/link';
import { ArrowLeft, Calendar, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VinegarVideoDetailPage({ 
    params: { locale, id } 
}: { 
    params: { locale: Locale; id: string } 
}) {
    const t = getTranslation(locale);
    const router = useRouter();
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVideo() {
            try {
                const docRef = doc(db, 'vinegar_videos', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setVideo({
                        id: docSnap.id,
                        title: data[`title_${locale}`] || data.title_ko || data.title_en || data.title || '',
                        description: data[`description_${locale}`] || data.description_ko || data.description_en || data.description || '',
                        videoUrl: data.videoUrl || '',
                        thumbnailUrl: data.thumbnailUrl || '',
                        createdAt: data.createdAt || ''
                    });
                } else {
                    router.push(`/${locale}/vinegar-videos`);
                }
            } catch (error) {
                console.error('Error fetching video:', error);
                router.push(`/${locale}/vinegar-videos`);
            } finally {
                setLoading(false);
            }
        }

        fetchVideo();
    }, [id, locale, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!video) {
        return null;
    }

    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const youtubeId = video.videoUrl ? getYouTubeId(video.videoUrl) : null;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href={`/${locale}/vinegar-videos/all`}
                    className="mb-6 inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>
                        {locale === 'ko' ? '목록으로 돌아가기' :
                         locale === 'en' ? 'Back to list' :
                         locale === 'id' ? 'Kembali ke daftar' :
                         locale === 'zh' ? '返回列表' :
                         locale === 'ja' ? 'リストに戻る' :
                         locale === 'ar' ? 'العودة إلى القائمة' :
                         'Back to list'}
                    </span>
                </Link>

                <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {youtubeId ? (
                        <div className="relative aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title={video.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : video.thumbnailUrl ? (
                        <div className="relative aspect-video">
                            <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                <PlayCircle size={64} className="text-white" />
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            <PlayCircle size={64} className="text-gray-400" />
                        </div>
                    )}
                    
                    <div className="p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {video.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
                            {video.createdAt && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {video.createdAt}
                                </span>
                            )}
                        </div>
                        
                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {video.description}
                            </div>
                        </div>
                        
                        {video.videoUrl && !youtubeId && (
                            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">
                                    {locale === 'ko' ? '동영상 링크:' :
                                     locale === 'en' ? 'Video Link:' :
                                     locale === 'id' ? 'Tautan Video:' :
                                     locale === 'zh' ? '视频链接:' :
                                     locale === 'ja' ? '動画リンク:' :
                                     locale === 'ar' ? 'رابط الفيديو:' :
                                     'Video Link:'}
                                </p>
                                <a 
                                    href={video.videoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 break-all"
                                >
                                    {video.videoUrl}
                                </a>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
}