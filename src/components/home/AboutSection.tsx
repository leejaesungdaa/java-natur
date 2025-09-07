'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import { Locale, getTranslation } from '@/lib/i18n/config';

interface AboutSectionProps {
    locale: Locale;
    aboutImage: string;
    aboutData?: {
        title: string;
        subtitle: string;
        whyTitle: string;
        description: string;
    };
}

export default function AboutSection({ locale, aboutImage, aboutData }: AboutSectionProps) {
    const t = getTranslation(locale);
    const [aboutRef, aboutVisible] = useAnimation({ threshold: 0.2 });
    
    const subtitle = aboutData?.subtitle || t.home.about.subtitle;
    const whyTitle = aboutData?.whyTitle || t.home.about.whyTitle;
    const description = aboutData?.description || t.home.about.description;
    const title = aboutData?.title || t.home.about.title;

    return (
        <section ref={aboutRef} className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        animate={aboutVisible ? "visible" : "hidden"}
                        variants={getAnimationVariant('slideLeft')}
                    >
                        <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">
                            {subtitle}
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {whyTitle}
                        </h2>
                        <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                            {description}
                        </p>
                        <Button href={`/${locale}/vinegar-info#sugarcane-benefits`} className="px-8 py-3 text-base">
                            {t.common.buttons.readMore}
                        </Button>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        animate={aboutVisible ? "visible" : "hidden"}
                        variants={getAnimationVariant('slideRight')}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={aboutImage}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={aboutVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="absolute -bottom-6 -left-6 bg-green-600 rounded-lg p-6 shadow-xl w-40 h-40 flex items-center justify-center"
                        >
                            <span className="text-white text-center font-bold">
                                {t.products.naturalIngredients}
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}