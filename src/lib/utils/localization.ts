export const getLocalizedField = <T extends Record<string, any>>(
    item: T | null | undefined,
    field: string,
    locale: string,
    fallbackLocale: string = 'en'
): string => {
    if (!item) return '';
    
    const primaryKey = `${field}_${locale}`;
    const fallbackKey = `${field}_${fallbackLocale}`;
    const defaultKey = field;
    
    const value = item[primaryKey] || item[fallbackKey] || item[defaultKey] || '';
    
    return typeof value === 'string' ? value : '';
};

export const createLocalizedObject = (
    field: string,
    values: Record<string, string>
): Record<string, string> => {
    const result: Record<string, string> = {};
    
    for (const [locale, value] of Object.entries(values)) {
        result[`${field}_${locale}`] = value;
    }
    
    return result;
};

export const extractLocalizedFields = (
    data: Record<string, any>,
    fields: string[]
): Record<string, any> => {
    const result: Record<string, any> = {};
    const locales = ['ko', 'en', 'id', 'zh', 'ja', 'ar'];
    
    for (const field of fields) {
        for (const locale of locales) {
            const key = `${field}_${locale}`;
            if (data[key]) {
                result[key] = data[key];
            }
        }
    }
    
    return result;
};

export const getAvailableLocales = (): string[] => {
    return ['ko', 'en', 'id', 'zh', 'ja', 'ar'];
};

export const formatLocaleLabel = (locale: string): string => {
    const labels: Record<string, string> = {
        ko: '한국어',
        en: 'English',
        id: 'Bahasa Indonesia',
        zh: '中文',
        ja: '日本語',
        ar: 'العربية'
    };
    
    return labels[locale] || locale.toUpperCase();
};