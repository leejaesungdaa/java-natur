'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import CallToAction from '@/components/sections/CallToAction';

export default function VinegarInfoPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const [classificationRef, classificationVisible] = useAnimation({ threshold: 0.2 });
    const [benefitsRef, benefitsVisible] = useAnimation({ threshold: 0.2 });
    const [productsRef, productsVisible] = useAnimation({ threshold: 0.2 });

    const fadeIn = getAnimationVariant('fadeIn');
    const slideUp = getAnimationVariant('slideUp');
    const slideLeft = getAnimationVariant('slideLeft');
    const slideRight = getAnimationVariant('slideRight');

    return (
        <div className="w-full pt-16">
            {/* Hero Section */}
            <HeroSection
                locale={locale}
                title={t.vinegarInfo.title}
                subtitle={t.vinegarInfo.description}
                imageSrc="/images/vinegar-info/hero-bg.jpg"
                height="medium"
            />

            {/* 식초 분류 섹션 */}
            <section ref={classificationRef} className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title={t.vinegarInfo.classification.title}
                        subtitle={t.vinegarInfo.classification.description}
                    />

                    <motion.div
                        initial="hidden"
                        animate={classificationVisible ? "visible" : "hidden"}
                        variants={fadeIn}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div
                            variants={slideUp}
                            custom={1}
                            className="bg-gray-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-4">{t.vinegarInfo.classification.synthetic}</h3>
                            <p className="text-gray-600 text-center">{t.vinegarInfo.classification.syntheticDesc}</p>
                        </motion.div>

                        <motion.div
                            variants={slideUp}
                            custom={2}
                            className="bg-gray-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-4">{t.vinegarInfo.classification.seasoned}</h3>
                            <p className="text-gray-600 text-center">{t.vinegarInfo.classification.seasonedDesc}</p>
                        </motion.div>

                        <motion.div
                            variants={slideUp}
                            custom={3}
                            className="bg-gray-50 rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65M12 6.5V17m0 0c-1.333-.667-2-1.5-2-2.5 0-1.5 1-2 2-3 1 1 2 1.5 2 3 0 1-1 2-2 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-4">{t.vinegarInfo.classification.natural}</h3>
                            <p className="text-gray-600 text-center">{t.vinegarInfo.classification.naturalDesc}</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate={classificationVisible ? "visible" : "hidden"}
                        variants={fadeIn}
                        transition={{ delay: 0.6 }}
                        className="mt-16 bg-gray-50 rounded-xl p-8 shadow-lg"
                    >
                        <h3 className="text-2xl font-bold text-center mb-6">{t.vinegarInfo.classification.fermentationTypes}</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-4">
                                    <span className="font-bold text-sm">1</span>
                                </div>
                                <p className="text-gray-700">{t.vinegarInfo.classification.fermentationType1}</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-4">
                                    <span className="font-bold text-sm">2</span>
                                </div>
                                <p className="text-gray-700">{t.vinegarInfo.classification.fermentationType2}</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-8 w-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center mr-4">
                                    <span className="font-bold text-sm">3</span>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 flex-1">
                                    <p className="text-gray-700 font-medium">{t.vinegarInfo.classification.fermentationType3}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 사탕수수 장점 섹션 */}
            <section id="sugarcane-benefits" ref={benefitsRef} className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title={t.vinegarInfo.sugarcaneBenefits.title}
                        subtitle={t.vinegarInfo.sugarcaneBenefits.nutrition.title}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <motion.div
                            initial="hidden"
                            animate={benefitsVisible ? "visible" : "hidden"}
                            variants={slideLeft}
                            className="h-full"
                        >
                            <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-xl">
                                <Image
                                    src="/images/vinegar-info/sugarcane.jpg"
                                    alt={t.vinegarInfo.sugarcaneBenefits.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate={benefitsVisible ? "visible" : "hidden"}
                            variants={slideRight}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold text-green-700 mb-3">{t.vinegarInfo.sugarcaneBenefits.nutrition.mineralTitle}</h3>
                                <p className="text-gray-700 mb-2">{t.vinegarInfo.sugarcaneBenefits.nutrition.mineralDesc}</p>
                                <p className="text-gray-700 mb-2">{t.vinegarInfo.sugarcaneBenefits.nutrition.mineralExample}</p>
                                <p className="text-gray-700">{t.vinegarInfo.sugarcaneBenefits.nutrition.healthEffect}</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold text-green-700 mb-3">{t.vinegarInfo.sugarcaneBenefits.nutrition.naturalSugarTitle}</h3>
                                <p className="text-gray-700 mb-3">{t.vinegarInfo.sugarcaneBenefits.nutrition.naturalSugar}</p>
                                <p className="text-gray-700">{t.vinegarInfo.sugarcaneBenefits.nutrition.polyphenols}</p>
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-500">
                                <h3 className="text-xl font-bold text-green-700 mb-3">{t.vinegarInfo.sugarcaneBenefits.summaryTitle}</h3>
                                <p className="text-gray-700">{t.vinegarInfo.sugarcaneBenefits.nutrition.summary}</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div
                            initial="hidden"
                            animate={benefitsVisible ? "visible" : "hidden"}
                            variants={fadeIn}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.vinegarInfo.sugarcaneBenefits.flavor.title}</h3>
                            <p className="text-gray-700 mb-4">{t.vinegarInfo.sugarcaneBenefits.flavor.desc}</p>
                            <p className="text-gray-700 mb-4">{t.vinegarInfo.sugarcaneBenefits.flavor.usage}</p>
                            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                                <p className="font-medium text-gray-800">{t.vinegarInfo.sugarcaneBenefits.flavor.summary}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate={benefitsVisible ? "visible" : "hidden"}
                            variants={fadeIn}
                            transition={{ delay: 0.5 }}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.vinegarInfo.sugarcaneBenefits.health.title}</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{t.vinegarInfo.sugarcaneBenefits.health.detox}</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{t.vinegarInfo.sugarcaneBenefits.health.antioxidant}</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{t.vinegarInfo.sugarcaneBenefits.health.bloodSugar}</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{t.vinegarInfo.sugarcaneBenefits.health.metabolism}</span>
                                </li>
                            </ul>
                            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mt-4">
                                <p className="font-medium text-gray-800">{t.vinegarInfo.sugarcaneBenefits.health.summary}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 제품별 특징 섹션 */}
            <section ref={productsRef} className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title={t.vinegarInfo.productDifferences.title}
                        subtitle={t.vinegarInfo.productDifferences.subtitle}
                    />

                    <div className="grid grid-cols-1 gap-16">
                        {/* 파인애플 식초 */}
                        <motion.div
                            initial="hidden"
                            animate={productsVisible ? "visible" : "hidden"}
                            variants={fadeIn}
                            className="bg-gray-50 rounded-xl p-8 shadow-lg overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md">
                                        <Image
                                            src="/images/products/product-1.jpg"
                                            alt={t.vinegarInfo.productDifferences.pineapple.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{t.vinegarInfo.productDifferences.pineapple.title}</h3>
                                    <p className="text-lg font-medium text-gray-700 mb-4">{t.vinegarInfo.productDifferences.pineapple.ingredients}</p>
                                </div>

                                <div className="md:col-span-2">
                                    <h4 className="text-xl font-bold text-green-700 mb-4">{t.vinegarInfo.productDifferences.pineapple.healthEffects}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.pineapple.digestionTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.pineapple.digestion}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.pineapple.inflammationTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.pineapple.inflammation}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.pineapple.immunityTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.pineapple.immunity}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.pineapple.bloodSugarTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.pineapple.bloodSugar}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                                        <p className="font-medium text-gray-800">{t.vinegarInfo.productDifferences.pineapple.feature}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 사과 식초 */}
                        <motion.div
                            initial="hidden"
                            animate={productsVisible ? "visible" : "hidden"}
                            variants={fadeIn}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-50 rounded-xl p-8 shadow-lg overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md">
                                        <Image
                                            src="/images/products/product-2.jpg"
                                            alt={t.vinegarInfo.productDifferences.apple.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{t.vinegarInfo.productDifferences.apple.title}</h3>
                                    <p className="text-lg font-medium text-gray-700 mb-4">{t.vinegarInfo.productDifferences.apple.ingredients}</p>
                                </div>

                                <div className="md:col-span-2">
                                    <h4 className="text-xl font-bold text-green-700 mb-4">{t.vinegarInfo.productDifferences.apple.healthEffects}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.apple.bloodSugarTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.apple.bloodSugar}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.apple.weightTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.apple.weight}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.apple.antioxidantTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.apple.antioxidant}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.apple.digestionTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.apple.digestion}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                                        <p className="font-medium text-gray-800">{t.vinegarInfo.productDifferences.apple.feature}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 용과 식초 */}
                        <motion.div
                            initial="hidden"
                            animate={productsVisible ? "visible" : "hidden"}
                            variants={fadeIn}
                            transition={{ delay: 0.5 }}
                            className="bg-gray-50 rounded-xl p-8 shadow-lg overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md">
                                        <Image
                                            src="/images/products/product-3.jpg"
                                            alt={t.vinegarInfo.productDifferences.dragonFruit.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{t.vinegarInfo.productDifferences.dragonFruit.title}</h3>
                                    <p className="text-lg font-medium text-gray-700 mb-4">{t.vinegarInfo.productDifferences.dragonFruit.ingredients}</p>
                                </div>

                                <div className="md:col-span-2">
                                    <h4 className="text-xl font-bold text-green-700 mb-4">{t.vinegarInfo.productDifferences.dragonFruit.healthEffects}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.dragonFruit.antioxidantTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.dragonFruit.antioxidant}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.dragonFruit.gutHealthTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.dragonFruit.gutHealth}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.dragonFruit.immunityTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.dragonFruit.immunity}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h5 className="font-bold text-gray-800 mb-2">{t.vinegarInfo.productDifferences.dragonFruit.bloodSugarTitle}</h5>
                                            <p className="text-gray-700">{t.vinegarInfo.productDifferences.dragonFruit.bloodSugar}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                                        <p className="font-medium text-gray-800">{t.vinegarInfo.productDifferences.dragonFruit.feature}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <CallToAction
                title={t.vinegarInfo.healthyLifestyle}
                subtitle={t.vinegarInfo.healthyLifestyleDesc}
                primaryButtonText={t.products.all}
                primaryButtonHref={`/${locale}/products`}
                secondaryButtonText={t.common.buttons.watchVideo}
                secondaryButtonHref={`/${locale}/vinegar-story#videos`}
                style="dark"
            />
        </div>
    );

}