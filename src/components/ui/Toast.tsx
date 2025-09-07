'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration, message]);

    const icons = {
        success: <CheckCircle className="w-6 h-6 text-green-400 drop-shadow-lg" />,
        error: <AlertCircle className="w-6 h-6 text-red-400 drop-shadow-lg" />,
        info: <Info className="w-6 h-6 text-blue-400 drop-shadow-lg" />
    };

    const colors = {
        success: 'from-green-500/30 to-emerald-600/30 border-green-400/60 shadow-green-500/25',
        error: 'from-red-500/30 to-rose-600/30 border-red-400/60 shadow-red-500/25',
        info: 'from-blue-500/30 to-indigo-600/30 border-blue-400/60 shadow-blue-500/25'
    };

    return (
        <motion.div
            initial={{ 
                opacity: 0, 
                y: -100, 
                scale: 0.8,
                filter: 'blur(10px)'
            }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                filter: 'blur(0px)'
            }}
            exit={{ 
                opacity: 0, 
                y: -30, 
                scale: 0.95,
                transition: { duration: 0.15 }
            }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 0.4
            }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className={`relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${colors[type]} backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border max-w-md mx-auto overflow-hidden group`}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                    duration: 1.5,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 3
                }}
            />
            <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                    delay: 0.1,
                    type: 'spring',
                    stiffness: 300
                }}
                className="relative z-10"
            >
                {icons[type]}
            </motion.div>
            <span className="text-white flex-1 font-medium relative z-10">{message}</span>
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg relative z-10"
            >
                <X className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type?: ToastType }>;
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex flex-col items-center gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        className="pointer-events-auto"
                    >
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => onRemove(toast.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}