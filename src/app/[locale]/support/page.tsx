'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import { motion } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import SectionHeader from '@/components/sections/SectionHeader';
import FAQSection from '@/components/sections/FAQSection';
import ContactForm from '@/components/sections/ContactForm';
import ContactDetails from '@/components/sections/ContactDetails';
import SocialMediaBar from '@/components/sections/SocialMediaBar';
import CallToAction from '@/components/sections/CallToAction';

export default function SupportPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const faqTopics = [
        { value: "Product Information", label: t.support.faq.topics.products },
        { value: "Order Inquiry", label: t.support.faq.topics.orders },
        { value: "Shipping & Delivery", label: t.support.faq.topics.shipping },
        { value: "Feedback", label: t.support.faq.topics.feedback },
        { value: "Other", label: t.support.faq.topics.other }
    ];

    const contactDetails = [
        {
            icon: (
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: t.company.contact.phone,
            content: (
                <>
                    <p className="text-gray-600">{t.footer.contact.phone}</p>
                    <p className="text-gray-600 mt-2">{t.support.contact.businessHours}</p>
                </>
            )
        },
        {
            icon: (
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: t.company.contact.email,
            content: (
                <>
                    <p className="text-gray-600">{t.footer.contact.email}</p>
                    <p className="text-gray-600 mt-2">support@naturjava.com</p>
                </>
            )
        },
        {
            icon: (
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: t.company.contact.address,
            content: <p className="text-gray-600">{t.footer.contact.address}</p>
        }
    ];

    const socialMedia = [
        {
            name: t.support.social.platforms.facebook,
            icon: (
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
            ),
            url: "https://facebook.com/naturjava"
        },
        {
            name: t.support.social.platforms.instagram,
            icon: (
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
            ),
            url: "https://instagram.com/naturjava"
        },
        {
            name: t.support.social.platforms.twitter,
            icon: (
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            ),
            url: "https://twitter.com/naturjava"
        }
    ];

    return (
        <div className="w-full pt-16">
            {/* Hero Section */}
            <HeroSection
                locale={locale}
                title={t.support.qa.title}
                subtitle={t.support.qa.description}
                imageSrc="/images/support-hero.jpg"
                height="small"
            />

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.faq}
                        title={t.support.faq.title}
                        subtitle={t.support.faq.description}
                    />

                    <div className="max-w-3xl mx-auto">
                        <FAQSection faqs={t.support.faq.items} columns={1} />
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <SectionHeader
                            overline={t.common.sections.getInTouch}
                            title={t.support.stillHaveQuestions}
                            subtitle={t.support.qa.description}
                        />

                        <ContactForm locale={locale} topics={faqTopics} />
                    </div>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        overline={t.common.sections.getInTouch}
                        title={t.support.contact.title}
                        subtitle={t.support.contact.subtitle}
                    />

                    <ContactDetails details={contactDetails} columns={3} />
                </div>
            </section>

            {/* Social Media Section */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <SectionHeader
                        overline={t.common.sections.connect}
                        title={t.support.social.title}
                        subtitle={t.support.social.subtitle}
                        color="light"
                    />

                    <SocialMediaBar socials={socialMedia} color="light" />
                </div>
            </section>
        </div>
    );
}