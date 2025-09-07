import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    timestamp: number;
}

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const ToastItem = React.memo<ToastItemProps>(({ toast, onRemove }) => {
    const handleRemove = useCallback(() => {
        onRemove(toast.id);
    }, [onRemove, toast.id]);

    const toastConfig = useMemo(() => {
        const configs = {
            success: {
                icon: CheckCircle,
                bgColor: 'bg-green-500',
                textColor: 'text-white',
                borderColor: 'border-green-600'
            },
            error: {
                icon: AlertCircle,
                bgColor: 'bg-red-500',
                textColor: 'text-white',
                borderColor: 'border-red-600'
            },
            warning: {
                icon: AlertTriangle,
                bgColor: 'bg-yellow-500',
                textColor: 'text-white',
                borderColor: 'border-yellow-600'
            },
            info: {
                icon: Info,
                bgColor: 'bg-blue-500',
                textColor: 'text-white',
                borderColor: 'border-blue-600'
            }
        };
        return configs[toast.type];
    }, [toast.type]);

    const Icon = toastConfig.icon;

    const variants = useMemo(() => ({
        initial: { opacity: 0, x: 300, scale: 0.3 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }
    }), []);

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`
                ${toastConfig.bgColor} ${toastConfig.textColor} ${toastConfig.borderColor}
                px-4 py-3 rounded-lg shadow-lg border-l-4 max-w-sm w-full
                flex items-center gap-3 backdrop-blur-sm
            `}
        >
            <Icon size={20} className="flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={handleRemove}
                className="flex-shrink-0 hover:bg-white/20 p-1 rounded transition-colors"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
});

ToastItem.displayName = 'ToastItem';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    maxToasts?: number;
}

export const ToastContainer = React.memo<ToastContainerProps>(({ 
    toasts, 
    onRemove, 
    position = 'top-right',
    maxToasts = 5
}) => {
    const positionClasses = useMemo(() => {
        const positions = {
            'top-right': 'top-4 right-4',
            'top-left': 'top-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'bottom-left': 'bottom-4 left-4',
            'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
            'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
        };
        return positions[position];
    }, [position]);

    const visibleToasts = useMemo(() => {
        return toasts.slice(-maxToasts);
    }, [toasts, maxToasts]);

    if (visibleToasts.length === 0) return null;

    return (
        <div className={`fixed ${positionClasses} z-50 space-y-2 pointer-events-none`}>
            <AnimatePresence mode="popLayout">
                {visibleToasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onRemove={onRemove} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
});

ToastContainer.displayName = 'ToastContainer';

// Export the original component for backward compatibility
export { ToastContainer as OptimizedToastContainer };

// Enhanced toast hook with better performance
interface ToastOptions {
    duration?: number;
    type?: ToastType;
    id?: string;
}

let toastCounter = 0;

export const createToast = (message: string, options: ToastOptions = {}): Toast => {
    const id = options.id || `toast-${++toastCounter}-${Date.now()}`;
    const type = options.type || 'info';
    const duration = options.duration ?? (type === 'error' ? 5000 : 3000);
    
    return {
        id,
        message,
        type,
        duration,
        timestamp: Date.now()
    };
};

// Utility functions for different toast types
export const createSuccessToast = (message: string, duration?: number) => 
    createToast(message, { type: 'success', duration });

export const createErrorToast = (message: string, duration?: number) => 
    createToast(message, { type: 'error', duration });

export const createWarningToast = (message: string, duration?: number) => 
    createToast(message, { type: 'warning', duration });

export const createInfoToast = (message: string, duration?: number) => 
    createToast(message, { type: 'info', duration });