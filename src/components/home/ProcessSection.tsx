'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { homePageService } from '@/lib/firebase/services';
import SectionHeader from '@/components/sections/SectionHeader';

interface ProcessSectionProps {
    locale: Locale;
}

export default function ProcessSection({ locale }: ProcessSectionProps) {
    const t = getTranslation(locale);
    const [processes, setProcesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProcesses = async () => {
            try {
                const data = await homePageService.getVinegarProcess(locale);
                setProcesses(data);
            } catch (error) {
                console.error('Error loading processes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProcesses();
    }, [locale]);

    if (loading) {
        return (
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (processes.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-gray-50">
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

                {/* Clean Modern Timeline */}
                <div className="relative max-w-6xl mx-auto mt-16">
                    {/* Central line - subtle gradient */}
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
                                                        <span className="text-green-600 font-semibold text-sm">
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
    );
}