'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/i18n/config';

interface CardProps {
    title: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    buttonText?: string;
    className?: string;
    children?: React.ReactNode;
    imagePriority?: boolean;
    tags?: string[];
    badge?: string;
    badgeColor?: 'green' | 'blue' | 'red' | 'purple' | 'yellow' | 'gray';
    hoverEffect?: boolean;
    date?: string;
    locale?: string;
    elevation?: 'none' | 'sm' | 'md' | 'lg';
    aspectRatio?: 'auto' | 'square' | 'video' | 'wide';
    imageOverlay?: boolean;
}

export default function Card({
    title,
    description,
    imageSrc,
    imageAlt = '',
    href,
    buttonText,
    className = '',
    children,
    imagePriority = false,
    tags = [],
    badge,
    badgeColor = 'green',
    hoverEffect = true,
    date,
    locale = 'en',
    elevation = 'sm',
    aspectRatio = 'auto',
    imageOverlay = false,
}: CardProps) {
    const badgeColors = {
        green: 'bg-green-100 text-green-800',
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800',
        purple: 'bg-purple-100 text-purple-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        gray: 'bg-gray-100 text-gray-800',
    };

    const elevationClass = {
        none: '',
        sm: 'shadow-sm hover:shadow',
        md: 'shadow hover:shadow-md',
        lg: 'shadow-md hover:shadow-lg',
    }[elevation];

    const aspectRatioClass = {
        auto: 'aspect-auto',
        square: 'aspect-square',
        video: 'aspect-video',
        wide: 'aspect-[21/9]',
    }[aspectRatio];

    const formattedDate = date
        ? formatDate(date, locale as any)
        : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
            className={`bg-white rounded-xl ${elevationClass} overflow-hidden group relative ${className}`}
        >
            {imageSrc && (
                <div className={`relative ${aspectRatioClass} w-full overflow-hidden rounded-t-xl`}>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={imagePriority}
                    />
                    {imageOverlay && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    {badge && (
                        <div className={`absolute top-3 right-3 ${badgeColors[badgeColor]} text-xs uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full`}>
                            {badge}
                        </div>
                    )}
                </div>
            )}
            <div className="p-6">
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {tags.map((tag, index) => (
                            <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    {title}
                </h3>

                {description && (
                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">{description}</p>
                )}

                {children}

                {buttonText && href && (
                    <div className="mt-5">
                        <Button href={href} variant="primary" size="sm">
                            {buttonText}
                        </Button>
                    </div>
                )}

                {date && (
                    <div className="mt-3 text-sm text-gray-500 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-500">{formattedDate}</span>
                    </div>
                )}
            </div>

            {href && !buttonText && (
                <Link href={href} className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 rounded-xl" aria-label={title}>
                    <span className="sr-only">{title}</span>
                </Link>
            )}
        </motion.div>
    );
}