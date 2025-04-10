'use client';

import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';

interface SectionHeaderProps {
    overline?: string;
    title: string;
    subtitle?: string;
    alignment?: 'left' | 'center' | 'right';
    color?: 'light' | 'dark';
}

export default function SectionHeader({
    overline,
    title,
    subtitle,
    alignment = 'center',
    color = 'dark',
}: SectionHeaderProps) {
    const [ref, isVisible] = useAnimation({ threshold: 0.3 });

    const textColor = color === 'dark'
        ? { title: 'text-gray-900', subtitle: 'text-gray-600', overline: 'text-green-600' }
        : { title: 'text-white', subtitle: 'text-white/90', overline: 'text-green-400' };

    const alignmentClass = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
    }[alignment];

    const maxWidthClass = alignment === 'center' ? 'max-w-3xl' : '';

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={getAnimationVariant('slideUp')}
            className={`mb-16 ${alignmentClass} ${maxWidthClass}`}
        >
            {overline && (
                <span className={`inline-block ${textColor.overline} font-semibold mb-4 tracking-wider`}>
                    {overline}
                </span>
            )}
            <h2 className={`text-4xl font-bold ${textColor.title} mb-6`}>{title}</h2>
            {subtitle && (
                <p className={`text-lg ${textColor.subtitle} max-w-3xl mx-auto`}>
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}