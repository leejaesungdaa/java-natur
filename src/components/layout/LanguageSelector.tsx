'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Locale, getLocaleName, getLocaleFlag } from '@/lib/i18n/config';
import { motion, AnimatePresence } from 'framer-motion';
import { setPreferredLanguage } from '@/lib/utils/languageCache';

interface LanguageSelectorProps {
    locale: Locale;
    isMobile?: boolean;
    isTransparent?: boolean;
}

export default function LanguageSelector({
    locale,
    isMobile = false,
    isTransparent = false
}: LanguageSelectorProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languageOptions = [
        { key: 'id', label: 'INDONESIA', flag: '/images/flags/id.png?v=1' },
        { key: 'ko', label: '한국어', flag: '/images/flags/ko.png?v=1' },
        { key: 'en', label: 'ENGLISH', flag: '/images/flags/en.png?v=1' },
        { key: 'ar', label: 'العربية', flag: '/images/flags/ar.png?v=1' },
        { key: 'zh', label: '中文', flag: '/images/flags/zt.png?v=1' },
        { key: 'ja', label: '日本語', flag: '/images/flags/ja.png?v=1' },
    ];

    const currentLanguage = languageOptions.find((lang) => lang.key === locale) || languageOptions[0];

    const switchLanguage = (newLocale: string) => {
        setPreferredLanguage(newLocale);
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        window.location.pathname = newPathname;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const buttonClass = isTransparent && !isMobile
        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
        : 'bg-white/90 text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none transition-colors ${isMobile
                    ? 'bg-white/90 text-gray-800 hover:bg-gray-100 w-full justify-center'
                    : buttonClass
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                aria-label="Select language"
            >
                <div className="relative h-5 w-7 overflow-hidden rounded shadow-sm">
                    <Image
                        src={getLocaleFlag(locale)}
                        alt={locale}
                        fill
                        sizes="20px"
                        className="object-cover"
                        priority
                    />
                </div>
                <span className="font-medium">{getLocaleName(locale)}</span>
                <motion.svg
                    className="h-4 w-4 text-current"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`absolute z-50 mt-1 ${isMobile ? 'w-full' : 'min-w-[180px]'
                            } rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden`}
                    >
                        <ul className="py-1">
                            {languageOptions.map((lang) => (
                                <li key={lang.key}>
                                    <button
                                        className={`flex items-center w-full px-4 py-2.5 text-sm ${locale === lang.key
                                            ? 'bg-gray-50 text-green-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                                            }`}
                                        onClick={() => switchLanguage(lang.key)}
                                    >
                                        <div className="relative h-5 w-7 overflow-hidden rounded shadow-sm mr-3">
                                            <Image
                                                src={lang.flag}
                                                alt={lang.key}
                                                fill
                                                sizes="20px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <span>{lang.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}