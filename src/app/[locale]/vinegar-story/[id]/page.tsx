'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VinegarStoryDetailPage({ 
    params: { locale, id } 
}: { 
    params: { locale: Locale; id: string } 
}) {
    const t = getTranslation(locale);
    const router = useRouter();
    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStory() {
            try {
                const docRef = doc(db, 'vinegar_stories', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStory({
                        id: docSnap.id,
                        title: data[`title_${locale}`] || data.title_ko || data.title_en || data.title || '',
                        summary: data[`summary_${locale}`] || data.summary_ko || data.summary_en || data.summary || '',
                        content: data[`content_${locale}`] || data.content_ko || data.content_en || data.content || '',
                        imageUrl: data.imageUrl || '',
                        createdAt: data.createdAt || '',
                        createdByName: data.createdByName || '',
                        updatedAt: data.updatedAt || '',
                        updatedByName: data.updatedByName || ''
                    });
                } else {
                    router.push(`/${locale}/vinegar-story`);
                }
            } catch (error) {
                console.error('Error fetching story:', error);
                router.push(`/${locale}/vinegar-story`);
            } finally {
                setLoading(false);
            }
        }

        fetchStory();
    }, [id, locale, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!story) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href={`/${locale}/vinegar-story/all`}
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
                    {story.imageUrl && (
                        <div className="relative h-96 w-full">
                            <Image
                                src={story.imageUrl}
                                alt={story.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 896px) 100vw, 896px"
                            />
                        </div>
                    )}
                    
                    <div className="p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {story.title}
                        </h1>
                        
                        {story.summary && (
                            <div className="text-lg text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                {story.summary}
                            </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
                            {story.createdAt && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {story.createdAt}
                                </span>
                            )}
                        </div>
                        
                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {story.content}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}