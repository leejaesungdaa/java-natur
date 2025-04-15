'use client';

import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import { Locale, getTranslation } from '@/lib/i18n/config';

interface HistoryEvent {
    year: string;
    title: string;
    description: string;
}

interface CompanyHistoryProps {
    locale: Locale;
    historyEvents: HistoryEvent[];
    title?: string;
    subtitle?: string;
    bgColor?: 'white' | 'gray';
}

export default function CompanyHistory({
    locale,
    historyEvents,
    title,
    subtitle,
    bgColor = 'white'
}: CompanyHistoryProps) {
    const t = getTranslation(locale);
    const [ref, isVisible] = useAnimation({ threshold: 0.1 });

    const bgClass = bgColor === 'white' ? 'bg-white' : 'bg-gray-50';

    return (
        <section id="history" className={`py-24 ${bgClass}`} ref={ref}>
            <div className="container mx-auto px-4">
                {(title || subtitle) && (
                    <div className="text-center mb-16">
                        {subtitle && (
                            <span className="inline-block text-green-600 font-semibold mb-2 tracking-wider">
                                {subtitle}
                            </span>
                        )}
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                {title}
                            </h2>
                        )}
                    </div>
                )}

                <div className="relative">
                    {/* 타임라인 중앙선 - 데스크톱 */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-green-200 hidden md:block"></div>

                    {/* 타임라인 컨텐츠 */}
                    {historyEvents.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                            className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:justify-end' : ''} mb-16 md:mb-24`}
                        >
                            <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative">
                                    {/* 모바일 연도 표시 - 좌측 상단 */}
                                    <div className="absolute -top-4 -left-2 md:hidden">
                                        <div className="bg-green-600 text-white text-lg font-bold px-4 py-1 rounded-full shadow-md">
                                            {item.year}
                                        </div>
                                    </div>

                                    {/* 데스크톱 연도 표시 */}
                                    <div className={`hidden md:flex items-center mb-4 ${index % 2 === 0 ? 'justify-end' : ''}`}>
                                        <div className="bg-green-600 text-white text-lg font-bold px-4 py-1 rounded-md">
                                            {item.year}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 pt-4 md:pt-0">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </div>

                            {/* 데스크톱 타임라인 포인트 */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 md:flex items-center justify-center hidden">
                                <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-md z-10"></div>
                            </div>

                            {/* 모바일 타임라인 */}
                            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-green-200 md:hidden"></div>
                            <div className="absolute left-4 top-10 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow md:hidden"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}