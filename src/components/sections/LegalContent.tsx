'use client';

import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';

interface ContentSection {
    title: string;
    content: string;
    items?: string[];
}

interface LegalContentProps {
    title: string;
    lastUpdated: string;
    sections: ContentSection[];
    contactInfo?: React.ReactNode;
}

export default function LegalContent({
    title,
    lastUpdated,
    sections,
    contactInfo
}: LegalContentProps) {
    const [ref, isVisible] = useAnimation({ threshold: 0.1 });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={getAnimationVariant('fadeInUp')}
            className="max-w-4xl mx-auto"
        >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-500 mb-10">{lastUpdated}</p>

            <div className="prose prose-lg max-w-none">
                {sections.map((section, index) => (
                    <section key={index} className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                        <p>{section.content}</p>

                        {section.items && section.items.length > 0 && (
                            <ul className="mt-4">
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="mb-2">{item}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}

                {contactInfo && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        {contactInfo}
                    </section>
                )}
            </div>
        </motion.div>
    );
}