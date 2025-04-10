'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { Variants } from 'framer-motion';

export type AnimationVariant =
    'fadeIn' |
    'slideUp' |
    'slideDown' |
    'slideLeft' |
    'slideRight' |
    'scale' |
    'rotate' |
    'fadeInUp' |
    'fadeInLeft' |
    'fadeInRight' |
    'stagger';

interface UseAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    delay?: number;
    duration?: number;
}

export function useAnimation(
    options: UseAnimationOptions = {}
): [RefObject<HTMLDivElement>, boolean] {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true,
    } = options;

    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        setHasAnimated(true);
                    }
                } else {
                    if (!triggerOnce) {
                        setIsVisible(false);
                    }
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin, triggerOnce]);

    return [ref, triggerOnce ? (isVisible || hasAnimated) : isVisible];
}

export function getAnimationVariant(variant: AnimationVariant, options: { delay?: number; duration?: number } = {}): Variants {
    const { delay = 0, duration = 0.5 } = options;

    const baseTransition = {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
    };

    switch (variant) {
        case 'fadeIn':
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: baseTransition }
            };
        case 'slideUp':
            return {
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: baseTransition }
            };
        case 'slideDown':
            return {
                hidden: { opacity: 0, y: -40 },
                visible: { opacity: 1, y: 0, transition: baseTransition }
            };
        case 'slideLeft':
            return {
                hidden: { opacity: 0, x: 40 },
                visible: { opacity: 1, x: 0, transition: baseTransition }
            };
        case 'slideRight':
            return {
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0, transition: baseTransition }
            };
        case 'scale':
            return {
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: baseTransition }
            };
        case 'rotate':
            return {
                hidden: { opacity: 0, rotate: -5, scale: 0.95 },
                visible: { opacity: 1, rotate: 0, scale: 1, transition: baseTransition }
            };
        case 'fadeInUp':
            return {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: baseTransition }
            };
        case 'fadeInLeft':
            return {
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: baseTransition }
            };
        case 'fadeInRight':
            return {
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: baseTransition }
            };
        case 'stagger':
            return {
                hidden: { opacity: 0, y: 20 },
                visible: (i = 0) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                        ...baseTransition,
                        delay: delay + (i * 0.1)
                    }
                })
            };
        default:
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: baseTransition }
            };
    }
}

export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0): Variants => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren,
            delayChildren
        }
    }
});