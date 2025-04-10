'use client';

import { Locale, getTranslation } from '@/lib/i18n/config';
import LegalContent from '@/components/sections/LegalContent';

export default function PrivacyPolicyPage({ params: { locale } }: { params: { locale: Locale } }) {
    const t = getTranslation(locale);

    const privacySections = [
        {
            title: t.legal.privacy.introduction.title,
            content: t.legal.privacy.introduction.content
        },
        {
            title: t.legal.privacy.dataCollection.title,
            content: t.legal.privacy.dataCollection.content,
            items: t.legal.privacy.dataCollection.items
        },
        {
            title: t.legal.privacy.dataPurpose.title,
            content: t.legal.privacy.dataPurpose.content,
            items: t.legal.privacy.dataPurpose.items
        },
        {
            title: t.legal.privacy.cookies.title,
            content: t.legal.privacy.cookies.content
        },
        {
            title: t.legal.privacy.rights.title,
            content: t.legal.privacy.rights.content,
            items: t.legal.privacy.rights.items
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
                    title={t.legal.privacy.title}
                    lastUpdated={t.legal.privacy.lastUpdated}
                    sections={privacySections}
                    contactInfo={contactInfo}
                />
            </div>
        </div>
    );
}