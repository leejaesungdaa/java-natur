'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import HeroHighlight from '@/components/home/HeroHighlight';
import { Locale, getTranslation } from '@/lib/i18n/config';

interface HeroSectionProps {
    locale: Locale;
    heroBg: string;
    heroData?: {
        title: string;
        subtitle: string;
        highlightedText: string;
    };
}

const HeroSection = memo(({ locale, heroBg, heroData }: HeroSectionProps) => {
    const t = getTranslation(locale);
    
    const title = heroData?.title || t.home.hero.title;
    const subtitle = heroData?.subtitle || t.home.hero.subtitle;
    const highlightedText = heroData?.highlightedText || t.home.hero.highlightedText;
    
    return (
        <section className="relative min-h-screen flex items-center">
            <Image
                src={heroBg}
                alt=""
                fill
                priority
                quality={90}
                className="object-cover"
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
            <div className="container mx-auto px-4 z-10">
                <div className="max-w-3xl mx-auto md:mx-0">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        {title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <HeroHighlight 
                            text={subtitle} 
                            highlightedText={highlightedText} 
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4">
                        <Button href={`/${locale}/products`} size="lg" className="px-8 py-4 text-base">
                            {t.products.all}
                        </Button>
                        <Button href={`/${locale}/company`} variant="outline" size="lg" className="px-8 py-4 text-base bg-transparent border-white text-white hover:bg-white/10">
                            {t.common.buttons.readMore}
                        </Button>
                    </motion.div>
                </div>
            </div>
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-0 right-0 text-center">
                <div className="bg-white p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </motion.div>
        </section>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;