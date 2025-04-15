'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Locale, getTranslation } from '@/lib/i18n/config';

interface SugarCaneBenefitsLinkProps {
    locale: Locale;
}

export default function SugarCaneBenefitsLink({ locale }: SugarCaneBenefitsLinkProps) {
    const t = getTranslation(locale);

    return (
        <motion.div
            whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl mt-8 cursor-pointer border border-green-200 shadow-sm hover:shadow-md"
            onClick={() => window.location.href = `/${locale}/vinegar-info#sugarcane-benefits`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-green-600 rounded-full p-2 mr-3 text-white flex items-center justify-center flex-shrink-0 h-8 w-8">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800 leading-none flex items-center">{t.company.about.whySugarcane.title}</span>
                </div>
                <div className="text-green-600 flex-shrink-0 ml-4 bg-white rounded-full flex items-center justify-center h-8 w-8 shadow-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
}