'use client';

import { useState, useCallback } from 'react';
import { ToastType } from '@/components/ui/Toast';

interface Toast {
    id: string;
    message: string;
    type?: ToastType;
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type?: ToastType) => {
        const id = Date.now().toString();
        setToasts([{ id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const updateToastMessages = useCallback((updateFn: (message: string) => string) => {
        setToasts((prev) => prev.map(toast => ({
            ...toast,
            message: updateFn(toast.message)
        })));
    }, []);

    return {
        toasts,
        showToast,
        removeToast,
        updateToastMessages
    };
}