'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'text';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    href?: string;
    external?: boolean;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    loading?: boolean;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    external = false,
    onClick,
    className = '',
    type = 'button',
    disabled = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    loading = false,
    rounded = 'md',
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
        primary: 'bg-green-600 text-white hover:text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow',
        secondary: 'bg-gray-800 text-white hover:text-white hover:bg-gray-900 focus:ring-gray-700 shadow-sm hover:shadow',
        outline: 'border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-green-500 hover:border-green-500',
        subtle: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
        text: 'text-green-600 hover:text-green-700 hover:bg-green-50 focus:ring-green-500',
    };

    const sizeStyles = {
        xs: 'text-xs px-2.5 py-1.5 space-x-1.5',
        sm: 'text-sm px-3 py-2 space-x-1.5',
        md: 'text-sm px-4 py-2.5 space-x-2',
        lg: 'text-base px-5 py-3 space-x-2.5',
        xl: 'text-lg px-6 py-3.5 space-x-3',
    };

    const roundedStyles = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const disabledStyles = disabled || loading
        ? 'opacity-60 cursor-not-allowed'
        : '';

    const widthStyles = fullWidth ? 'w-full' : '';

    let allStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${disabledStyles} ${widthStyles} ${className}`;

    if (className.includes('border-white') && className.includes('hover:bg-white')) {
        allStyles = `${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} border border-white bg-transparent text-white hover:bg-white hover:text-gray-900`;
    }
    else if (className.includes('bg-gray-100') && className.includes('text-gray-900')) {
        allStyles = `${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${className} hover:text-gray-900`;
    }

    const content = (
        <>
            {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {icon && iconPosition === 'left' && !loading && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
    );

    if (href && external) {
        return (
            <motion.a
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
                href={href}
                className={allStyles}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
            >
                {content}
            </motion.a>
        );
    }

    if (href) {
        return (
            <div className={fullWidth ? "block w-full" : "inline-block"}>
                <motion.div
                    whileHover={!disabled ? { scale: 1.02 } : undefined}
                    whileTap={!disabled ? { scale: 0.98 } : undefined}
                >
                    <Link
                        href={href}
                        className={allStyles}
                        onClick={onClick}
                    >
                        {content}
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            type={type}
            className={allStyles}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {content}
        </motion.button>
    );
}