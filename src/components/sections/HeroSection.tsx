'use client';

import { motion } from 'framer-motion';
import { Locale, getTranslation } from '@/lib/i18n/config';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
    locale: Locale;
    title: string;
    subtitle: string;
    imageSrc: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    height?: 'full' | 'large' | 'medium' | 'small';
    overlay?: 'dark' | 'light' | 'gradient' | 'none';
    showScrollIndicator?: boolean;
    alignment?: 'left' | 'center' | 'right';
}

export default function HeroSection({
    locale,
    title,
    subtitle,
    imageSrc,
    primaryButtonText,
    primaryButtonHref,
    secondaryButtonText,
    secondaryButtonHref,
    height = 'large',
    overlay = 'gradient',
    showScrollIndicator = false,
    alignment = 'left',
}: HeroSectionProps) {
    const t = getTranslation(locale);

    const heightClass = {
        full: 'min-h-screen',
        large: 'h-[80vh]',
        medium: 'h-[60vh]',
        small: 'h-[40vh]',
    }[height];

    const overlayClass = {
        dark: 'bg-black/60',
        light: 'bg-black/30',
        gradient: 'bg-gradient-to-b from-black/70 to-black/30',
        none: '',
    }[overlay];

    const alignmentClass = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
    }[alignment];

    const maxWidthClass = alignment === 'center' ? 'max-w-3xl' : 'max-w-2xl';

    return (
        <section
            className={`relative ${heightClass} bg-cover bg-center flex items-center`}
            style={{ backgroundImage: `url(${imageSrc})` }}
        >
            <div className={`absolute inset-0 ${overlayClass}`}></div>
            <div className="container mx-auto px-4 z-10 relative">
                <div className={`${alignmentClass} ${maxWidthClass}`}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>

                    {(primaryButtonText || secondaryButtonText) && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            {primaryButtonText && (
                                <Button
                                    href={primaryButtonHref || '#'}
                                    size="lg"
                                    className="px-8 py-4 text-base"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    }
                                    iconPosition="right"
                                >
                                    {primaryButtonText}
                                </Button>
                            )}

                            {secondaryButtonText && (
                                <Button
                                    href={secondaryButtonHref || '#'}
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 text-base bg-transparent border-white text-white hover:bg-white/10 hover:text-white"
                                >
                                    {secondaryButtonText}
                                </Button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {showScrollIndicator && (
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-0 right-0 text-center"
                >
                    <div className="bg-white/90 p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </motion.div>
            )}
        </section>
    );
}