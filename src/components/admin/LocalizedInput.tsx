'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { getAvailableLocales, formatLocaleLabel } from '@/lib/utils/localization';
import { cn } from '@/lib/utils/common';

interface LocalizedInputProps {
    fieldName: string;
    value: Record<string, string>;
    onChange: (locale: string, value: string) => void;
    type?: 'text' | 'textarea';
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export default function LocalizedInput({
    fieldName,
    value,
    onChange,
    type = 'text',
    placeholder,
    required = false,
    className
}: LocalizedInputProps) {
    const [activeLocale, setActiveLocale] = useState('ko');
    const locales = getAvailableLocales();
    
    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <div className="flex gap-1">
                    {locales.map(locale => (
                        <button
                            key={locale}
                            type="button"
                            onClick={() => setActiveLocale(locale)}
                            className={cn(
                                'px-3 py-1 text-xs font-medium rounded-lg transition-all',
                                activeLocale === locale
                                    ? 'bg-green-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                        >
                            {formatLocaleLabel(locale)}
                        </button>
                    ))}
                </div>
            </div>
            
            {type === 'textarea' ? (
                <textarea
                    value={value[activeLocale] || ''}
                    onChange={(e) => onChange(activeLocale, e.target.value)}
                    placeholder={placeholder}
                    required={required && activeLocale === 'ko'}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                    rows={4}
                />
            ) : (
                <input
                    type="text"
                    value={value[activeLocale] || ''}
                    onChange={(e) => onChange(activeLocale, e.target.value)}
                    placeholder={placeholder}
                    required={required && activeLocale === 'ko'}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
            )}
            
            {required && activeLocale === 'ko' && !value[activeLocale] && (
                <p className="text-xs text-red-500 mt-1">한국어는 필수입니다</p>
            )}
        </div>
    );
}