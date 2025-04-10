'use client';

import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';

interface ContactDetail {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
}

interface ContactDetailsProps {
    details: ContactDetail[];
    columns?: 1 | 2 | 3;
    background?: 'white' | 'light' | 'dark';
}

export default function ContactDetails({
    details,
    columns = 3,
    background = 'light'
}: ContactDetailsProps) {
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    const bgClass = {
        white: 'bg-white',
        light: 'bg-gray-50',
        dark: 'bg-gray-800 text-white',
    }[background];

    const textClass = background === 'dark' ? 'text-white' : 'text-gray-900';
    const subTextClass = background === 'dark' ? 'text-gray-300' : 'text-gray-600';

    const colsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
    }[columns];

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer()}
            className={`grid grid-cols-1 ${colsClass} gap-8`}
        >
            {details.map((detail, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    variants={getAnimationVariant('stagger')}
                    className={`${bgClass === 'bg-white' ? 'bg-gray-50' : 'bg-white'} p-8 rounded-xl text-center hover:shadow-md transition-shadow duration-300`}
                >
                    <div className="text-green-600 mb-6 mx-auto">
                        {detail.icon}
                    </div>
                    <h3 className={`text-xl font-bold ${textClass} mb-4`}>{detail.title}</h3>
                    <div className={subTextClass}>{detail.content}</div>
                </motion.div>
            ))}
        </motion.div>
    );
}