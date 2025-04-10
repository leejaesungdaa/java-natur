'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import CallToAction from '@/components/sections/CallToAction';

export default function CompanyPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const [aboutRef, aboutVisible] = useAnimation({ threshold: 0.2 });
    const [storyRef, storyVisible] = useAnimation({ threshold: 0.2 });
    const [historyRef, historyVisible] = useAnimation({ threshold: 0.2 });
    const [contactRef, contactVisible] = useAnimation({ threshold: 0.2 });

    const fadeIn = getAnimationVariant('fadeIn');
    const slideUp = getAnimationVariant('slideUp');
    const slideLeft = getAnimationVariant('slideLeft');
    const slideRight = getAnimationVariant('slideRight');

    const historyEvents = [
        {
            year: "2010",
            title: t.company.history.events.founding,
            description: t.company.history.events.foundingDesc
        },
        {
            year: "2012",
            title: t.company.history.events.launch,
            description: t.company.history.events.launchDesc
        },
        {
            year: "2015",
            title: t.company.history.events.expansion,
            description: t.company.history.events.expansionDesc
        },
        {
            year: "2018",
            title: t.company.history.events.facility,
            description: t.company.history.events.facilityDesc
        },
        {
            year: "2020",
            title: t.company.history.events.international,
            description: t.company.history.events.internationalDesc
        },
        {
            year: "2023",
            title: t.company.history.events.sustainable,
            description: t.company.history.events.sustainableDesc
        }
    ];

    const companyValues = [
        {
            title: t.company.about.values.quality,
            description: t.company.about.values.qualityDesc
        },
        {
            title: t.company.about.values.sustainability,
            description: t.company.about.values.sustainabilityDesc
        },
        {
            title: t.company.about.values.innovation,
            description: t.company.about.values.innovationDesc
        },
        {
            title: t.company.about.values.tradition,
            description: t.company.about.values.traditionDesc
        }
    ];

    return (
        <div className="w-full pt-16">
            {/* Hero Section */}
            <HeroSection
                locale={locale}
                title={t.company.about.title}
                subtitle={t.company.about.description}
                imageSrc="/images/company-hero.jpg"
                height="medium"
            />

            {/* About Company Section */}
            <section id="about" className="py-24 bg-white" ref={aboutRef}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate={aboutVisible ? "visible" : "hidden"}
                            variants={slideLeft}
                        >
                            <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">{t.common.sections.aboutUs}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.company.about.title}</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                {t.company.about.fullDescription}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                {companyValues.map((value, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                                            <p className="text-gray-600 text-sm">{value.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate={aboutVisible ? "visible" : "hidden"}
                            variants={slideRight}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl">
                                <Image
                                    src="/images/company-about.jpg"
                                    alt={t.company.about.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Brand Story Section */}
            <section id="story" className="py-24 bg-gray-50" ref={storyRef}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate={storyVisible ? "visible" : "hidden"}
                            variants={slideLeft}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="order-2 md:order-1"
                        >
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl">
                                <Image
                                    src="/images/brand-story.jpg"
                                    alt={t.company.story.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate={storyVisible ? "visible" : "hidden"}
                            variants={slideRight}
                            className="order-1 md:order-2"
                        >
                            <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">{t.common.sections.ourJourney}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.company.story.title}</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                {t.company.story.paragraph1}
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                {t.company.story.paragraph2}
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                {t.company.story.paragraph3}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* History Timeline Section */}
            <section id="history" className="py-24 bg-white" ref={historyRef}>
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.company.history.subtitle}
                        title={t.company.history.title}
                        subtitle={t.company.history.subtitle}
                    />

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-green-200 hidden md:block"></div>

                        {/* Timeline Items */}
                        {historyEvents.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={historyVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:justify-end' : ''} mb-16 md:mb-24`}
                            >
                                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'justify-end' : ''}`}>
                                            <div className="bg-green-600 text-white text-lg font-bold px-4 py-1 rounded-md">
                                                {item.year}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>

                                {/* Timeline Dot - Only visible on md and up */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 md:flex items-center justify-center hidden">
                                    <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow"></div>
                                </div>

                                {/* Mobile timeline dot and line */}
                                <div className="absolute left-0 top-0 h-full w-0.5 bg-green-200 ml-6 md:hidden"></div>
                                <div className="absolute left-0 top-10 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow ml-4.5 md:hidden"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-gray-50" ref={contactRef}>
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.getInTouch}
                        title={t.company.contact.title}
                        subtitle={t.company.contact.getInTouchDescription}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <motion.div
                            initial="hidden"
                            animate={contactVisible ? "visible" : "hidden"}
                            variants={slideLeft}
                        >
                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-full mr-4">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.company.contact.address}</h3>
                                        <p className="text-gray-600">
                                            {t.footer.contact.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-full mr-4">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.company.contact.phone}</h3>
                                        <p className="text-gray-600">{t.footer.contact.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-full mr-4">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.company.contact.email}</h3>
                                        <p className="text-gray-600">{t.footer.contact.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate={contactVisible ? "visible" : "hidden"}
                            variants={slideRight}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="h-80 w-full relative">
                                    <Image
                                        src="/images/company-map.jpg"
                                        alt={t.company.contact.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="bg-white rounded-lg py-2 px-4 shadow-lg">
                                            <p className="font-medium text-gray-900">CV. SIYUN JAYA</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t.company.contact.factory}</h3>
                                    <p className="text-gray-600 mb-6">
                                        {t.company.contact.factoryDescription}
                                    </p>
                                    <Button href={`/${locale}/support`} className="w-full justify-center">
                                        {t.common.buttons.contactUs}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <CallToAction
                title={t.home.cta.joinTitle}
                subtitle={t.home.cta.joinDescription}
                primaryButtonText={t.products.all}
                primaryButtonHref={`/${locale}/products`}
                secondaryButtonText={t.common.buttons.contactUs}
                secondaryButtonHref={`/${locale}/support`}
                style="dark"
            />
        </div>
    );
}