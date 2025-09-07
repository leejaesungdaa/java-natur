import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Toast, ToastType, createToast } from '@/components/ui/OptimizedToast';

interface UseToastReturn {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType, options?: { duration?: number; id?: string }) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
    updateToastMessages: (updateFn: (message: string) => string) => void;
}

export const useOptimizedToast = (): UseToastReturn => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const maxToasts = useRef(10); // Maximum number of toasts to keep in memory

    // Cleanup timers on unmount
    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            timers.forEach((timer) => clearTimeout(timer));
            timers.clear();
        };
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
    }, []);

    const showToast = useCallback((
        message: string, 
        type: ToastType = 'info', 
        options: { duration?: number; id?: string } = {}
    ): string => {
        const toast = createToast(message, { type, ...options });
        
        setToasts(prevToasts => {
            const newToasts = [...prevToasts, toast];
            // Keep only the latest maxToasts
            if (newToasts.length > maxToasts.current) {
                const removedToasts = newToasts.slice(0, newToasts.length - maxToasts.current);
                removedToasts.forEach(removedToast => {
                    const timer = timersRef.current.get(removedToast.id);
                    if (timer) {
                        clearTimeout(timer);
                        timersRef.current.delete(removedToast.id);
                    }
                });
                return newToasts.slice(-maxToasts.current);
            }
            return newToasts;
        });

        // Auto-remove toast after duration
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                removeToast(toast.id);
            }, toast.duration);
            
            timersRef.current.set(toast.id, timer);
        }

        return toast.id;
    }, [removeToast]);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();
    }, []);

    const updateToastMessages = useCallback((updateFn: (message: string) => string) => {
        setToasts(prevToasts => 
            prevToasts.map(toast => ({
                ...toast,
                message: updateFn(toast.message)
            }))
        );
    }, []);

    // Memoize the return object to prevent unnecessary re-renders
    const returnValue = useMemo(() => ({
        toasts,
        showToast,
        removeToast,
        clearAllToasts,
        updateToastMessages
    }), [toasts, showToast, removeToast, clearAllToasts, updateToastMessages]);

    return returnValue;
};

// Context provider for global toast management
import React, { createContext, useContext, ReactNode } from 'react';

interface ToastContextValue extends UseToastReturn {
    success: (message: string, duration?: number) => string;
    error: (message: string, duration?: number) => string;
    warning: (message: string, duration?: number) => string;
    info: (message: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
    children: ReactNode;
    maxToasts?: number;
}

export const ToastProvider = React.memo<ToastProviderProps>(({ children, maxToasts = 10 }) => {
    const toastUtils = useOptimizedToast();
    
    const contextValue = useMemo(() => ({
        ...toastUtils,
        success: (message: string, duration?: number) => 
            toastUtils.showToast(message, 'success', { duration }),
        error: (message: string, duration?: number) => 
            toastUtils.showToast(message, 'error', { duration }),
        warning: (message: string, duration?: number) => 
            toastUtils.showToast(message, 'warning', { duration }),
        info: (message: string, duration?: number) => 
            toastUtils.showToast(message, 'info', { duration })
    }), [toastUtils]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
});

ToastProvider.displayName = 'ToastProvider';

export const useToastContext = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
};

// Convenience hooks for specific toast types
export const useSuccessToast = () => {
    const { success } = useToastContext();
    return success;
};

export const useErrorToast = () => {
    const { error } = useToastContext();
    return error;
};

export const useWarningToast = () => {
    const { warning } = useToastContext();
    return warning;
};

export const useInfoToast = () => {
    const { info } = useToastContext();
    return info;
};