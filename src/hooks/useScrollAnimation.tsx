'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

export type ScrollAnimationVariants = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';

export function useScrollAnimation(
    options: {
        threshold?: number;
        rootMargin?: string;
        triggerOnce?: boolean;
        variant?: ScrollAnimationVariants;
    } = {}
): [RefObject<HTMLDivElement>, boolean] {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true,
        variant = 'fadeIn'
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

export function getAnimationVariants(variant: ScrollAnimationVariants) {
    switch (variant) {
        case 'fadeIn':
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.6 } }
            };
        case 'slideUp':
            return {
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            };
        case 'slideDown':
            return {
                hidden: { opacity: 0, y: -50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            };
        case 'slideLeft':
            return {
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            };
        case 'slideRight':
            return {
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            };
        case 'scale':
            return {
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
            };
        case 'rotate':
            return {
                hidden: { opacity: 0, rotate: -5, scale: 0.9 },
                visible: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.6 } }
            };
        default:
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.6 } }
            };
    }
}