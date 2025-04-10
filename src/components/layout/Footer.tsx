'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';

interface FooterProps {
    locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
    const t = getTranslation(locale);
    const currentYear = new Date().getFullYear();
    const [ref, isVisible] = useAnimation({ threshold: 0.1 });

    const fadeInUpVariants = getAnimationVariant('fadeInUp');

    // Social media icons with tooltip
    const socialLinks = [
        {
            name: 'Facebook',
            icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
            url: 'https://facebook.com/naturjava'
        },
        {
            name: 'Instagram',
            icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
            url: 'https://instagram.com/naturjava'
        },
        {
            name: 'Twitter',
            icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
            url: 'https://twitter.com/naturjava'
        }
    ];

    const footerLinks = [
        {
            title: t.common.menu.company,
            links: [
                { href: `/${locale}/company`, label: t.company.about.title },
                { href: `/${locale}/company#story`, label: t.company.story.title },
                { href: `/${locale}/company#history`, label: t.company.history.title },
                { href: `/${locale}/company#contact`, label: t.company.contact.title }
            ]
        },
        {
            title: t.common.menu.vinegarStory,
            links: [
                { href: `/${locale}/vinegar-story`, label: t.vinegarStory.info.title },
                { href: `/${locale}/vinegar-story#videos`, label: t.vinegarStory.videos.title }
            ]
        }
    ];

    return (
        <footer ref={ref} className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <motion.div
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        custom={0}
                        variants={fadeInUpVariants}
                        className="col-span-1 md:col-span-5"
                    >
                        <Link href={`/${locale}`} className="inline-block mb-6">
                            <Image
                                src="/images/logo-white.png"
                                alt="NATUR JAVA"
                                width={180}
                                height={60}
                                className="h-12 w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 mb-8 max-w-md">
                            {t.footer.description}
                        </p>
                        <div className="flex space-x-6">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    whileHover={{ scale: 1.1, color: '#22c55e' }}
                                    whileTap={{ scale: 0.95 }}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors relative group"
                                    aria-label={social.name}
                                >
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d={social.icon} />
                                    </svg>
                                    <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {social.name}
                                    </span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {footerLinks.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            custom={sectionIndex + 1}
                            variants={fadeInUpVariants}
                            className="col-span-1 md:col-span-2"
                        >
                            <h3 className="text-lg font-semibold mb-6">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-green-400 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    <motion.div
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        custom={3}
                        variants={fadeInUpVariants}
                        className="col-span-1 md:col-span-3"
                    >
                        <h3 className="text-lg font-semibold mb-6">{t.company.contact.title}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-gray-400">{t.footer.contact.address}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-gray-400">{t.footer.contact.phone}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-400">{t.footer.contact.email}</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    custom={4}
                    variants={fadeInUpVariants}
                    className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
                >
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        &copy; {currentYear} CV. SIYUN JAYA | NATUR JAVA. {t.footer.rights}.
                    </p>
                    <div className="flex space-x-6">
                        <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                            {t.footer.privacy}
                        </Link>
                        <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                            {t.footer.terms}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}