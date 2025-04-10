'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';

interface Store {
    name: string;
    url: string;
}

interface ProductBuyOptionsProps {
    locale: Locale;
    stores: Store[];
}

export default function ProductBuyOptions({
    locale,
    stores
}: ProductBuyOptionsProps) {
    const t = getTranslation(locale);
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer()}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
            {stores.map((store: Store, index: number) => (
                <motion.div
                    key={index}
                    custom={index}
                    variants={getAnimationVariant('stagger')}
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{store.name}</h3>
                    <Button
                        href={store.url}
                        className="w-full justify-center"
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        }
                    >
                        {t.common.buttons.buyNow}
                    </Button>
                </motion.div>
            ))}
        </motion.div>
    );
}