'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import { Locale, getTranslation } from '@/lib/i18n/config';

interface ProductFeaturesProps {
    locale: Locale;
    features: string[];
    benefits: string[];
}

export default function ProductFeatures({
    locale,
    features,
    benefits
}: ProductFeaturesProps) {
    const t = getTranslation(locale);
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    const featuresTitle = typeof t.products.features === 'string'
        ? t.products.features
        : 'Features';

    const benefitsTitle = typeof t.products.productBenefits === 'string'
        ? t.products.productBenefits
        : 'Benefits';

    return (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={getAnimationVariant('slideLeft')}
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{featuresTitle}</h2>
                <ul className="space-y-4">
                    {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                            <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={getAnimationVariant('slideRight')}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{benefitsTitle}</h2>
                <ul className="space-y-4">
                    {benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start">
                            <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
}