'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import CallToAction from '@/components/sections/CallToAction';
import GoogleMap from '@/components/sections/GoogleMap';
import SugarCaneBenefitsLink from '@/components/sections/SugarCaneBenefitsLink';
import CompanyHistory from '@/components/sections/CompanyHistory';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';

export default function CompanyPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const [aboutRef, aboutVisible] = useAnimation({ threshold: 0.2 });
    const [storyRef, storyVisible] = useAnimation({ threshold: 0.2 });
    const [contactRef, contactVisible] = useAnimation({ threshold: 0.2 });
    const [contactInfo, setContactInfo] = useState({
        address: t.footer.contact.address,
        phone: t.footer.contact.phone,
        email: t.footer.contact.email,
        latitude: -6.5510,
        longitude: 107.4840
    });

    const fadeIn = getAnimationVariant('fadeIn');
    const slideUp = getAnimationVariant('slideUp');
    const slideLeft = getAnimationVariant('slideLeft');
    const slideRight = getAnimationVariant('slideRight');

    // Firebase에서 연락처 정보 로드
    useEffect(() => {
        loadContactInfo();
    }, [locale]);

    const loadContactInfo = async () => {
        try {
            const q = query(collection(db, 'contact_info'), limit(1));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                const addressKey = locale === 'en' ? 'addressEnglish' : 'address';
                
                setContactInfo({
                    address: data[addressKey] || data.address || t.footer.contact.address,
                    phone: data.phone || t.footer.contact.phone,
                    email: data.email || t.footer.contact.email,
                    latitude: data.latitude || -6.5510,
                    longitude: data.longitude || 107.4840
                });
            }
        } catch (error) {
            console.error('Error loading contact info:', error);
        }
    };

    // 기본 히스토리 이벤트 (Firebase에 데이터가 없을 경우 사용)
    const defaultHistoryEvents = [
        {
            year: "2016",
            title: t.company.history.events.dev2016,
            description: t.company.history.events.dev2016Desc
        },
        {
            year: "2018",
            title: t.company.history.events.sample2018,
            description: t.company.history.events.sample2018Desc
        },
        {
            year: "2019",
            title: t.company.history.events.production2019,
            description: t.company.history.events.production2019Desc
        },
        {
            year: "2021",
            title: t.company.history.events.certification2021,
            description: t.company.history.events.certification2021Desc
        },
        {
            year: "2022",
            title: t.company.history.events.expansion2022,
            description: t.company.history.events.expansion2022Desc
        },
        {
            year: "2024",
            title: t.company.history.events.oem2024,
            description: t.company.history.events.oem2024Desc
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
            <HeroSection
                locale={locale}
                title={t.company.about.title}
                subtitle={t.company.about.description}
                imageSrc="/images/company-hero.jpg"
                height="medium"
            />

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

                            <SugarCaneBenefitsLink locale={locale} />
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

            <CompanyHistory
                locale={locale}
                historyEvents={defaultHistoryEvents}
                title={t.company.history.title}
                subtitle={t.company.history.subtitle}
                bgColor="white"
                useFirebase={true}
            />

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
                                            {contactInfo.address}
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
                                        <p className="text-gray-600">{contactInfo.phone}</p>
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
                                        <p className="text-gray-600">{contactInfo.email}</p>
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
                                    <iframe
                                        src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${contactInfo.latitude},${contactInfo.longitude}&zoom=15&maptype=roadmap`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="absolute inset-0"
                                    ></iframe>
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
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