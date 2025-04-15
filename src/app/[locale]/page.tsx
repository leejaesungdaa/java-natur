'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAnimation, getAnimationVariant } from '@/hooks/useAnimation';

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const [aboutRef, aboutVisible] = useAnimation({ threshold: 0.2 });
    const [productsRef, productsVisible] = useAnimation({ threshold: 0.2 });
    const [benefitsRef, benefitsVisible] = useAnimation({ threshold: 0.2 });
    const [testimonialsRef, testimonialsVisible] = useAnimation({ threshold: 0.2 });

    const renderHeroSubtitle = () => {
        const subtitleText = t.home.hero.subtitle;
        const highlightText = t.home.hero.highlightedText;
        const parts = subtitleText.split(highlightText);

        return (
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
                {parts[0]}
                <motion.span
                    initial={{
                        backgroundColor: "rgba(34, 197, 94, 0)",
                        color: "white",
                        scale: 1,
                        y: 0,
                        boxShadow: "0 0 0 rgba(34, 197, 94, 0)"
                    }}
                    animate={{
                        backgroundColor: ["rgba(34, 197, 94, 0)", "rgba(34, 197, 94, 0.7)", "rgba(34, 197, 94, 0)"],
                        color: ["white", "#ffffff", "white"],
                        scale: [1, 1.25, 1],
                        y: [0, -8, 0],
                        boxShadow: [
                            "0 0 0 rgba(34, 197, 94, 0)",
                            "0 0 20px rgba(34, 197, 94, 0.8)",
                            "0 0 0 rgba(34, 197, 94, 0)"
                        ],
                        textShadow: [
                            "0 0 0px rgba(255,255,255,0)",
                            "0 0 15px rgba(255,255,255,1)",
                            "0 0 0px rgba(255,255,255,0)"
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: "easeInOut"
                    }}
                    className="relative font-bold px-3 py-1 rounded-md mx-2 inline-block"
                >
                    <span className="relative z-10">{highlightText}</span>
                </motion.span>
                {parts[1]}
            </p>
        );
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative min-h-screen bg-cover bg-center flex items-center"
                style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
                <div className="container mx-auto px-4 z-10">
                    <div className="max-w-3xl mx-auto md:mx-0">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" >
                            {t.home.hero.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {renderHeroSubtitle()}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-4" >
                            <Button href={`/${locale}/products`} size="lg" className="px-8 py-4 text-base">
                                {t.products.all}
                            </Button>
                            <Button href={`/${locale}/company`} variant="outline" size="lg" className="px-8 py-4 text-base bg-transparent border-white text-white hover:bg-white/10">
                                {t.common.buttons.readMore}
                            </Button>
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-0 right-0 text-center" >
                    <div className="bg-white p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </motion.div>
            </section>

            {/* About Section */}
            <section ref={aboutRef} className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate={aboutVisible ? "visible" : "hidden"}
                            variants={getAnimationVariant('slideLeft')}
                        >
                            <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">{t.home.about.subtitle}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{t.home.about.whyTitle}</h2>
                            <p className="text-lg text-gray-700 mb-10 leading-relaxed">{t.home.about.description}</p>
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
                                    src="/images/about-image.jpg"
                                    alt={t.home.about.title}
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
                                <span className="text-white text-center font-bold">{t.products.naturalIngredients}</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product Preview Section */}
            <section ref={productsRef} className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={productsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">{t.common.sections.discover}</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.home.products.title}</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {t.home.products.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                image: "/images/products/product-1.jpg",
                                title: "Natur Java Apple Cider Vinegar",
                                description: "Premium apple cider vinegar with natural ingredients.",
                                link: `/${locale}/products/apple-cider-vinegar`
                            },
                            {
                                image: "/images/products/product-2.jpg",
                                title: "Natur Java Rice Vinegar",
                                description: "Traditional rice vinegar for authentic Asian cuisine.",
                                link: `/${locale}/products/rice-vinegar`
                            },
                            {
                                image: "/images/products/product-3.jpg",
                                title: "Natur Java Coconut Vinegar",
                                description: "Organic coconut vinegar with probiotic benefits.",
                                link: `/${locale}/products/coconut-vinegar`
                            }
                        ].map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={productsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                                className="bg-white rounded-xl shadow-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        priority={index === 0}
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{product.title}</h3>
                                    <p className="text-gray-600 mb-6">{product.description}</p>
                                    <Button
                                        href={product.link}
                                        variant="outline"
                                        className="w-full justify-center"
                                    >
                                        {t.common.buttons.readMore}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={productsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-center mt-16"
                    >
                        <Button href={`/${locale}/products`} size="lg" className="px-10 py-4">
                            {t.home.products.viewAll}
                        </Button>
                    </motion.div>
                </div>
            </section>

            <section ref={benefitsRef} className="py-24 bg-green-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={benefitsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">{t.common.sections.healthLifestyle}</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.home.benefits.title}</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {t.home.benefits.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: (
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                ),
                                title: t.home.benefits.health.title,
                                description: t.home.benefits.health.description
                            },
                            {
                                icon: (
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                    </svg>
                                ),
                                title: t.home.benefits.culinary.title,
                                description: t.home.benefits.culinary.description
                            },
                            {
                                icon: (
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                ),
                                title: t.home.benefits.household.title,
                                description: t.home.benefits.household.description
                            }
                        ].map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={benefitsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                                className="bg-white p-10 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="text-green-600 mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Button
                            href={`/${locale}/vinegar-story#videos`}
                            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white"
                            size="lg"
                            icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        >
                            {t.common.buttons.watchVideoCheck}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section ref={testimonialsRef} className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={testimonialsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-green-600 font-semibold mb-4 tracking-wider">{t.common.sections.testimonials}</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.home.testimonials.title}</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {t.home.testimonials.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {t.home.testimonials.items.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={testimonialsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="text-yellow-400 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-6 italic">
                                    "{testimonial.text}"
                                </p>
                                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                <div className="text-gray-500 text-sm">{testimonial.position}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold mb-8">{t.home.cta.title}</h2>
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
        </div>
    );
}