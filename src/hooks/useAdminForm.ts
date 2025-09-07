import { useState, useCallback } from 'react';
import { getCurrentAdminInfo } from '@/lib/auth/authHelpers';
import { formatJakartaTime } from '@/lib/utils/dateFormat';

interface UseAdminFormProps<T> {
    initialData?: T;
    onSave: (data: any) => Promise<void>;
    onCancel?: () => void;
}

export function useAdminForm<T extends Record<string, any>>({
    initialData,
    onSave,
    onCancel
}: UseAdminFormProps<T>) {
    const [formData, setFormData] = useState<T>(initialData || {} as T);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const updateField = useCallback((field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);
    
    const updateLocalizedField = useCallback((field: string, locale: string, value: string) => {
        const key = `${field}_${locale}`;
        updateField(key, value);
    }, [updateField]);
    
    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        
        return Object.keys(newErrors).length === 0;
    }, []);
    
    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!validate()) return;
        
        setSaving(true);
        try {
            const adminInfo = await getCurrentAdminInfo();
            const now = formatJakartaTime(new Date().toISOString());
            
            const dataToSave: any = {
                ...formData,
                updatedBy: adminInfo?.uid || '',
                updatedByName: adminInfo?.name || '',
                updatedAt: now
            };
            
            if (!formData.id) {
                dataToSave.createdBy = adminInfo?.uid || '';
                dataToSave.createdByName = adminInfo?.name || '';
                dataToSave.createdAt = now;
            }
            
            await onSave(dataToSave);
        } finally {
            setSaving(false);
        }
    }, [formData, onSave, validate]);
    
    const handleCancel = useCallback(() => {
        setFormData(initialData || {} as T);
        setErrors({});
        if (onCancel) onCancel();
    }, [initialData, onCancel]);
    
    const reset = useCallback(() => {
        setFormData({} as T);
        setErrors({});
    }, []);
    
    return {
        formData,
        setFormData,
        updateField,
        updateLocalizedField,
        saving,
        errors,
        handleSubmit,
        handleCancel,
        reset
    };
}