import { Locale, locales } from '@/lib/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
    title: 'NATUR JAVA',
    description: 'CV. SIYUN JAYA - NATUR JAVA offers premium quality vinegar products made with natural ingredients from Java island.',
};

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: Locale };
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header locale={locale} />
            <main className="flex-grow pt-0">{children}</main>
            <Footer locale={locale} />
            <ScrollToTop locale={locale} />
        </div>
    );
}