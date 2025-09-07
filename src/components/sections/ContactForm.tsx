'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import { inquiryService } from '@/lib/firebase/services';

interface ContactFormProps {
    locale: Locale;
    topics?: { value: string; label: string }[];
}

export default function ContactForm({
    locale,
    topics
}: ContactFormProps) {
    const t = getTranslation(locale);
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [formStatus, setFormStatus] = useState<null | 'sending' | 'success' | 'error'>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');

        try {
            await inquiryService.addInquiry({
                ...formState,
                locale,
                createdAt: new Date(),
            });

            setFormStatus('success');
            setFormState({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            setFormStatus('error');
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={getAnimationVariant('fadeInUp')}
        >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                {t.support.qa.form.name}
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formState.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                {t.support.qa.form.email}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formState.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            {t.support.qa.form.subject}
                        </label>
                        {topics ? (
                            <select
                                id="subject"
                                name="subject"
                                value={formState.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">{t.support.qa.form.subject}</option>
                                {topics.map((topic) => (
                                    <option key={topic.value} value={topic.value}>{topic.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formState.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            {t.support.qa.form.message}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formState.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        ></textarea>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            size="lg"
                            className="px-10"
                            disabled={formStatus === 'sending'}
                            loading={formStatus === 'sending'}
                        >
                            {formStatus === 'sending' ? t.common.loading : t.support.qa.form.submit}
                        </Button>
                    </div>

                    {formStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-green-100 text-green-700 rounded-md text-center"
                        >
                            {t.support.qa.form.success}
                        </motion.div>
                    )}

                    {formStatus === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-100 text-red-700 rounded-md text-center"
                        >
                            {t.support.qa.form.error}
                        </motion.div>
                    )}
                </form>
            </div>
        </motion.div>
    );
}