import en from './locales/en';
import id from './locales/id';
import ko from './locales/ko';

export const defaultLocale = 'id';
export const locales = ['en', 'id', 'ko'] as const;
export type Locale = typeof locales[number];

export const translations = {
    en,
    id,
    ko,
};

export function getTranslation(locale: Locale) {
    return translations[locale] || translations[defaultLocale];
}

export function getTranslationByKey(locale: Locale, key: string) {
    const keys = key.split('.');
    let translation = getTranslation(locale) as any;

    for (const k of keys) {
        if (!translation[k]) return null;
        translation = translation[k];
    }

    return translation;
}

export function getLocaleName(locale: Locale): string {
    const localeNames = {
        en: 'English',
        id: 'Indonesia',
        ko: '한국어'
    };

    return localeNames[locale] || localeNames[defaultLocale];
}

export function getLocaleFlag(locale: Locale): string {
    return `/images/flags/${locale}.png`;
}

export function formatDate(date: string | Date, locale: Locale): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleDateString(
        locale === 'en' ? 'en-US' : locale === 'id' ? 'id-ID' : 'ko-KR',
        { year: 'numeric', month: 'numeric', day: 'numeric' }
    );
}