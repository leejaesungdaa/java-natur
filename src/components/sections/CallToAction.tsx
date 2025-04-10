'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';

interface CTAProps {
    title: string;
    subtitle?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    style?: 'dark' | 'light' | 'green';
}

export default function CallToAction({
    title,
    subtitle,
    primaryButtonText,
    primaryButtonHref,
    secondaryButtonText,
    secondaryButtonHref,
    style = 'dark',
}: CTAProps) {
    const [ref, isVisible] = useAnimation({ threshold: 0.3 });

    const bgClass = {
        dark: 'bg-gray-900 text-white',
        light: 'bg-gray-50 text-gray-900',
        green: 'bg-gradient-to-r from-green-600 to-green-500 text-white',
    }[style];

    const buttonStyle = style === 'dark' || style === 'green'
        ? {
            primary: 'bg-gray-100 text-gray-900 hover:bg-white hover:text-gray-900 border border-gray-200 h-14',
            secondary: 'bg-transparent border-white text-white hover:bg-white/10 hover:text-white h-14'
        }
        : {
            primary: 'bg-green-600 text-white hover:bg-green-700 hover:text-white h-14',
            secondary: 'bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 h-14'
        };

    return (
        <section className={`py-24 ${bgClass}`}>
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    variants={getAnimationVariant('fadeInUp')}
                >
                    <h2 className="text-4xl font-bold mb-8">{title}</h2>
                    {subtitle && (
                        <p className="text-xl mb-10 max-w-3xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                    <div className="flex flex-wrap justify-center gap-4">
                        {primaryButtonText && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    href={primaryButtonHref || '#'}
                                    size="lg"
                                    variant="outline"
                                    className={`px-10 py-4 ${buttonStyle.primary}`}
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h14" />
                                        </svg>
                                    }
                                    iconPosition="right"
                                >
                                    {primaryButtonText}
                                </Button>
                            </motion.div>
                        )}

                        {secondaryButtonText && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    href={secondaryButtonHref || '#'}
                                    size="lg"
                                    variant="outline"
                                    className={`px-10 py-4 ${buttonStyle.secondary}`}
                                >
                                    {secondaryButtonText}
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}