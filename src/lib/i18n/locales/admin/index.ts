import { adminTranslationsEn } from './en';
import { adminTranslationsKo } from './ko';
import { adminTranslationsJa } from './ja';
import { adminTranslationsId } from './id';
import { adminTranslationsAr } from './ar';
import { adminTranslationsZh } from './zh';

export const adminTranslations = {
    en: adminTranslationsEn,
    ko: adminTranslationsKo,
    ja: adminTranslationsJa,
    id: adminTranslationsId,
    ar: adminTranslationsAr,
    zh: adminTranslationsZh,
} as const;

export type AdminLocale = keyof typeof adminTranslations;
export type AdminTranslations = typeof adminTranslations[AdminLocale];

export function getAdminTranslation(locale: string): any {
    const validLocale = (locale in adminTranslations) ? locale as AdminLocale : 'en';
    return adminTranslations[validLocale];
}