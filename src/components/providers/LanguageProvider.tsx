'use client';

import { useEffect } from 'react';
import { setPreferredLanguage } from '@/lib/utils/languageCache';

export default function LanguageProvider({ 
    locale, 
    children 
}: { 
    locale: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        setPreferredLanguage(locale);
        document.cookie = `preferred_language=${locale}; path=/; max-age=31536000; samesite=lax`;
    }, [locale]);

    return <>{children}</>;
}