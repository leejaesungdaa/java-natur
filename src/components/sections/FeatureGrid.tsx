'use client';

import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface FeatureGridProps {
    features: Feature[];
    columns?: 1 | 2 | 3 | 4;
    background?: 'white' | 'light' | 'dark';
    centerTitle?: boolean;
    iconSize?: 'small' | 'medium' | 'large';
}

export default function FeatureGrid({
    features,
    columns = 3,
    background = 'white',
    centerTitle = false,
    iconSize = 'medium',
}: FeatureGridProps) {
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    const bgClass = {
        white: 'bg-white',
        light: 'bg-gray-50',
        dark: 'bg-gray-900',
    }[background];

    const textClass = background === 'dark' ? 'text-white' : 'text-gray-900';
    const descriptionClass = background === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const cardClass = background === 'dark' ? 'bg-gray-800' : 'bg-white';
    const iconBgClass = background === 'dark' ? 'bg-green-900/30' : 'bg-green-100';
    const iconClass = background === 'dark' ? 'text-green-400' : 'text-green-600';

    const colsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    const iconSizeClass = {
        small: 'h-12 w-12',
        medium: 'h-16 w-16',
        large: 'h-20 w-20',
    }[iconSize];

    const titleClass = centerTitle ? 'text-center' : '';

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer()}
            className={`grid grid-cols-1 ${colsClass} gap-8`}
        >
            {features.map((feature, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    variants={getAnimationVariant('stagger')}
                    className={`${cardClass} p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-${centerTitle ? 'center' : 'start'}`}
                >
                    <div className={`${iconBgClass} ${iconClass} mb-6 ${iconSizeClass} flex items-center justify-center rounded-full`}>
                        {feature.icon}
                    </div>
                    <h3 className={`text-xl font-bold ${textClass} mb-4 ${titleClass}`}>{feature.title}</h3>
                    <p className={`${descriptionClass} ${titleClass}`}>{feature.description}</p>
                </motion.div>
            ))}
        </motion.div>
    );
}