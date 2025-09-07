import { useParams } from 'next/navigation';
import { getLocalizedField } from '@/lib/utils/localization';

export const useLocalization = () => {
    const params = useParams();
    const locale = (params?.locale as string) || 'ko';
    
    const getField = <T extends Record<string, any>>(
        item: T | null | undefined,
        field: string
    ): string => {
        return getLocalizedField(item, field, locale);
    };
    
    const getMultipleFields = <T extends Record<string, any>>(
        item: T | null | undefined,
        fields: string[]
    ): Record<string, string> => {
        const result: Record<string, string> = {};
        
        for (const field of fields) {
            result[field] = getField(item, field);
        }
        
        return result;
    };
    
    return {
        locale,
        getField,
        getMultipleFields,
        isRTL: locale === 'ar'
    };
};