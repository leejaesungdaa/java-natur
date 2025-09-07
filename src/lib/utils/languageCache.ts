const LANGUAGE_CACHE_KEY = 'site_language';

export const getPreferredLanguage = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LANGUAGE_CACHE_KEY);
};

export const setPreferredLanguage = (locale: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LANGUAGE_CACHE_KEY, locale);
    document.cookie = `site_language=${locale}; path=/; max-age=31536000; samesite=lax`;
};

export const getAdminLanguage = (): string | null => {
    return getPreferredLanguage();
};

export const setAdminLanguage = (locale: string): void => {
    setPreferredLanguage(locale);
};

export const syncLanguageFromWebsite = (): string => {
    const websiteLanguage = getPreferredLanguage();
    if (websiteLanguage) {
        return websiteLanguage;
    }
    return 'en';
};

export const detectBrowserLanguage = (): string => {
    if (typeof window === 'undefined') return 'en';
    
    const browserLang = navigator.language.toLowerCase();
    const langMap: { [key: string]: string } = {
        'ko': 'ko',
        'ko-kr': 'ko',
        'id': 'id',
        'id-id': 'id',
        'ar': 'ar',
        'ar-sa': 'ar',
        'zh': 'zh',
        'zh-cn': 'zh',
        'zh-tw': 'zh',
        'ja': 'ja',
        'ja-jp': 'ja',
        'en': 'en',
        'en-us': 'en',
        'en-gb': 'en'
    };
    
    return langMap[browserLang] || 'en';
};