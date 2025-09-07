'use client';

import { motion } from 'framer-motion';
import { useAnimation } from '@/hooks/useAnimation';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';

interface Testimonial {
    text: string;
    name: string;
    position: string;
    rating?: number;
}

interface TestimonialsSectionProps {
    locale: Locale;
}

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
    const t = getTranslation(locale);
    const [testimonialsRef, testimonialsVisible] = useAnimation({ threshold: 0.2 });
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTestimonialsFromFirebase();
    }, [locale]);

    const loadTestimonialsFromFirebase = async () => {
        try {
            const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const firebaseTestimonials: Testimonial[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const textKey = `text_${locale}`;
                    const positionKey = `position_${locale}`;
                    firebaseTestimonials.push({
                        text: data[textKey] || data.text || '',
                        name: data.name || '',
                        position: data[positionKey] || data.position || '',
                        rating: data.rating || 5
                    });
                });
                setTestimonials(firebaseTestimonials);
            } else {
                setTestimonials(t.home.testimonials.items);
            }
        } catch (error) {
            console.error('Error loading testimonials from Firebase:', error);
            setTestimonials(t.home.testimonials.items);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section ref={testimonialsRef} className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={testimonialsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">
                        {t.common.sections.testimonials}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        {t.home.testimonials.title}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {t.home.testimonials.subtitle}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={testimonialsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                            className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-6">
                                <div className="text-yellow-400 flex">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                        <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6 italic">
                                "{testimonial.text}"
                            </p>
                            <div className="font-semibold text-gray-900">
                                {testimonial.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                                {testimonial.position}
                            </div>
                        </motion.div>
                    ))}
                </div>
                )}
            </div>
        </section>
    );
}