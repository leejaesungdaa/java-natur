'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';

interface CTASectionProps {
    locale: Locale;
}

export default function CTASection({ locale }: CTASectionProps) {
    const t = getTranslation(locale);

    return (
        <section className="py-24 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold mb-8">
                        {t.home.cta.title}
                    </h2>
                    <p className="text-xl mb-10 max-w-3xl mx-auto">
                        {t.home.cta.subtitle}
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            href={`/${locale}/products`}
                            size="lg"
                            className="px-10 py-4 bg-gray-100 text-gray-900 hover:bg-white hover:text-gray-900 border border-gray-200"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h14"></path>
                                </svg>
                            }
                            iconPosition="right"
                        >
                            {t.products.all}
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}