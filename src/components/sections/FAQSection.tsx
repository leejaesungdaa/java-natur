'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
    columns?: 1 | 2;
}

export default function FAQSection({
    faqs,
    columns = 1
}: FAQSectionProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const colsClass = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer()}
            className={`grid grid-cols-1 ${colsClass} gap-8`}
        >
            {faqs.map((faq, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    variants={getAnimationVariant('stagger')}
                    className="mb-6"
                >
                    <motion.div
                        className={`bg-gray-50 rounded-xl transition-shadow duration-300 ${expandedIndex === index ? 'shadow-md' : 'hover:shadow-md'
                            }`}
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                        >
                            <h3 className="text-xl font-bold text-gray-900">{faq.question}</h3>
                            <motion.svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </button>
                        <motion.div
                            initial={false}
                            animate={{
                                height: expandedIndex === index ? 'auto' : 0,
                                opacity: expandedIndex === index ? 1 : 0,
                                marginBottom: expandedIndex === index ? 16 : 0
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden px-6"
                        >
                            <p className="text-gray-600 pb-6">{faq.answer}</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
}