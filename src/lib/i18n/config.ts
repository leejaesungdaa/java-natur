import en from './locales/en';
import id from './locales/id';
import ko from './locales/ko';
import ar from './locales/ar';
import zh from './locales/zh';
import ja from './locales/ja';

export const defaultLocale = 'id';
export const locales = ['id', 'ko', 'en', 'ar', 'zh', 'ja'] as const;
export type Locale = typeof locales[number];

export const translations = {
    en,
    id,
    ko,
    ar,
    zh,
    ja,
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
        id: 'Indonesia',
        ko: '한국어',
        en: 'English',
        ar: 'العربية',
        zh: '中文',
        ja: '日本語'
    };

    return localeNames[locale] || localeNames[defaultLocale];
}

export function getLocaleFlag(locale: Locale): string {
    if (locale === 'zh') {
        return '/images/flags/zt.png';
    }
    return `/images/flags/${locale}.png`;
}

export function formatDate(date: string | Date, locale: Locale): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const localeMap = {
        en: 'en-US',
        id: 'id-ID',
        ko: 'ko-KR',
        ar: 'ar-SA',
        zh: 'zh-CN',
        ja: 'ja-JP'
    };

    return dateObj.toLocaleDateString(
        localeMap[locale] || localeMap[defaultLocale],
        { year: 'numeric', month: 'numeric', day: 'numeric' }
    );
}