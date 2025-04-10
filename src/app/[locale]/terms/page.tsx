'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import LegalContent from '@/components/sections/LegalContent';

export default function TermsOfServicePage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const termsSections = [
        {
            title: t.legal.terms.introduction.title,
            content: t.legal.terms.introduction.content
        },
        {
            title: t.legal.terms.intellectualProperty.title,
            content: t.legal.terms.intellectualProperty.content
        },
        {
            title: t.legal.terms.userLicense.title,
            content: t.legal.terms.userLicense.content,
            items: t.legal.terms.userLicense.restrictions.items
        },
        {
            title: t.legal.terms.userComments.title,
            content: t.legal.terms.userComments.content
        },
        {
            title: t.legal.terms.liability.title,
            content: t.legal.terms.liability.content
        }
    ];

    const contactInfo = (
        <div className="mt-4 bg-gray-50 p-6 rounded-lg">
            <p className="font-bold mb-2">CV. SIYUN JAYA</p>
            <p>{t.footer.contact.address}</p>
            <p>{t.footer.contact.email}</p>
            <p>{t.footer.contact.phone}</p>
        </div>
    );

    return (
        <div className="w-full pt-20">
            <div className="container mx-auto px-4 py-12">
                <LegalContent
                    title={t.legal.terms.title}
                    lastUpdated={t.legal.terms.lastUpdated}
                    sections={termsSections}
                    contactInfo={contactInfo}
                />
            </div>
        </div>
    );
}