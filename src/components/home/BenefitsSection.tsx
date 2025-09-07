'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useAnimation } from '@/hooks/useAnimation';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { ReactNode, useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';

interface Benefit {
    icon: ReactNode;
    title: string;
    description: string;
}

interface BenefitsSectionProps {
    locale: Locale;
}

export default function BenefitsSection({ locale }: BenefitsSectionProps) {
    const t = getTranslation(locale);
    const [benefitsRef, benefitsVisible] = useAnimation({ threshold: 0.2 });
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [loading, setLoading] = useState(true);
    const [vinegarVideos, setVinegarVideos] = useState<any[]>([]);

    const defaultBenefits: Benefit[] = [
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

    useEffect(() => {
        loadBenefitsFromFirebase();
        loadVinegarVideos();
    }, [locale]);

    const loadBenefitsFromFirebase = async () => {
        try {
            const q = query(collection(db, 'vinegar_info'), orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const firebaseBenefits: Benefit[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const titleKey = `title_${locale}`;
                    const benefitsKey = `benefits_${locale}`;
                    
                    if (data[benefitsKey] && Array.isArray(data[benefitsKey]) && data[benefitsKey].length > 0) {
                        firebaseBenefits.push({
                            icon: (
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ),
                            title: data[titleKey] || data.vinegarType || '',
                            description: data[benefitsKey].join(', ')
                        });
                    }
                });
                
                if (firebaseBenefits.length > 0) {
                    setBenefits(firebaseBenefits.slice(0, 3)); // 최대 3개만 표시
                } else {
                    setBenefits(defaultBenefits);
                }
            } else {
                setBenefits(defaultBenefits);
            }
        } catch (error) {
            console.error('Error loading benefits from Firebase:', error);
            setBenefits(defaultBenefits);
        } finally {
            setLoading(false);
        }
    };

    const loadVinegarVideos = async () => {
        try {
            const q = query(collection(db, 'vinegar_videos'), orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const videos: any[] = [];
                querySnapshot.forEach((doc) => {
                    videos.push(doc.data());
                });
                setVinegarVideos(videos);
            }
        } catch (error) {
            console.error('Error loading videos from Firebase:', error);
        }
    };

    const videoButtonHref = vinegarVideos.length > 0 
        ? vinegarVideos[0].videoUrl 
        : `/${locale}/vinegar-story#videos`;

    return (
        <section ref={benefitsRef} className="py-24 bg-green-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={benefitsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">
                        {t.common.sections.healthLifestyle}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        {t.home.benefits.title}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {t.home.benefits.subtitle}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={benefitsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                            className="bg-white p-10 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-green-600 mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                                {benefit.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
                )}

                <div className="text-center mt-16">
                    <Button
                        href={videoButtonHref}
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    >
                        {t.common.buttons.watchVideoCheck}
                    </Button>
                </div>
            </div>
        </section>
    );
}