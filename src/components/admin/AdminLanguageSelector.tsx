'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { setPreferredLanguage } from '@/lib/utils/languageCache';

interface Language {
    code: string;
    name: string;
    flag: string;
}

const languages: Language[] = [
    { code: 'id', name: 'INDONESIA', flag: '/images/flags/id.png?v=1' },
    { code: 'ko', name: '한국어', flag: '/images/flags/ko.png?v=1' },
    { code: 'en', name: 'ENGLISH', flag: '/images/flags/en.png?v=1' },
    { code: 'ar', name: 'العربية', flag: '/images/flags/ar.png?v=1' },
    { code: 'zh', name: '中文', flag: '/images/flags/zt.png?v=1' },
    { code: 'ja', name: '日本語', flag: '/images/flags/ja.png?v=1' }
];

interface AdminLanguageSelectorProps {
    currentLocale: string;
    onLocaleChange: (locale: string) => void;
    variant?: 'default' | 'white';
}

export default function AdminLanguageSelector({ currentLocale, onLocaleChange, variant = 'default' }: AdminLanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState<Language>(
        languages.find(lang => lang.code === currentLocale) || languages[0]
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const lang = languages.find(lang => lang.code === currentLocale);
        if (lang) {
            setSelectedLang(lang);
        }
    }, [currentLocale]);

    const handleLanguageChange = (language: Language) => {
        setSelectedLang(language);
        setPreferredLanguage(language.code);
        onLocaleChange(language.code);
        setIsOpen(false);
    };

    const isWhite = variant === 'white';
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg"
            >
                <div className="relative w-6 h-6">
                    <Image
                        src={selectedLang.flag}
                        alt={selectedLang.name}
                        fill
                        className="object-cover rounded-sm"
                        sizes="24px"
                    />
                </div>
                <span className={`text-sm font-medium ${isWhite ? 'text-white' : 'text-gray-800'} hidden sm:block`}>{selectedLang.name}</span>
                <svg
                    className={`w-4 h-4 ${isWhite ? 'text-white' : 'text-gray-700'} transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 backdrop-blur-xl"
                    >
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                                    selectedLang.code === language.code ? 'bg-gray-100 dark:bg-gray-800' : ''
                                }`}
                            >
                                <div className="relative w-6 h-6 flex-shrink-0">
                                    <Image
                                        src={language.flag}
                                        alt={language.name}
                                        fill
                                        className="object-cover rounded-sm"
                                        sizes="24px"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{language.name}</span>
                                {selectedLang.code === language.code && (
                                    <svg
                                        className="w-5 h-5 text-green-500 ml-auto"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}