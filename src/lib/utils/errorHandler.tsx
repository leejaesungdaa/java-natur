// Error handling utilities with proper logging and user-friendly messages
import React from 'react';

export interface ErrorInfo {
    message: string;
    code?: string;
    operation?: string;
    timestamp: string;
    userAgent?: string;
}

export class AppError extends Error {
    public code: string;
    public operation: string;
    public userMessage: string;
    public timestamp: string;

    constructor(
        message: string,
        code: string = 'UNKNOWN_ERROR',
        operation: string = 'unknown',
        userMessage?: string
    ) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.operation = operation;
        this.userMessage = userMessage || this.getFriendlyMessage(code);
        this.timestamp = new Date().toISOString();
    }

    private getFriendlyMessage(code: string): string {
        const friendlyMessages: Record<string, string> = {
            'auth/user-not-found': 'User account not found',
            'auth/wrong-password': 'Invalid password',
            'auth/invalid-email': 'Invalid email format',
            'auth/email-already-in-use': 'Email is already registered',
            'auth/weak-password': 'Password is too weak',
            'auth/too-many-requests': 'Too many attempts. Please try again later',
            'auth/network-request-failed': 'Network error. Please check your connection',
            'permission-denied': 'You do not have permission for this action',
            'unavailable': 'Service temporarily unavailable',
            'not-found': 'Requested resource not found',
            'already-exists': 'Resource already exists',
            'invalid-argument': 'Invalid input provided',
            'NETWORK_ERROR': 'Network connection error',
            'VALIDATION_ERROR': 'Input validation failed',
            'UNKNOWN_ERROR': 'An unexpected error occurred'
        };

        return friendlyMessages[code] || 'An error occurred. Please try again.';
    }
}

export class ErrorLogger {
    private static instance: ErrorLogger;
    private isDevelopment: boolean;

    private constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    static getInstance(): ErrorLogger {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }

    log(error: Error | AppError, context?: Record<string, any>): void {
        const errorInfo: ErrorInfo = {
            message: error.message,
            code: error instanceof AppError ? error.code : 'UNHANDLED_ERROR',
            operation: error instanceof AppError ? error.operation : 'unknown',
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
        };

        if (this.isDevelopment) {
            console.group(`🔴 ${errorInfo.operation} Error`);
            console.error('Message:', errorInfo.message);
            console.error('Code:', errorInfo.code);
            console.error('Timestamp:', errorInfo.timestamp);
            if (context) {
                console.error('Context:', context);
            }
            console.error('Stack:', error.stack);
            console.groupEnd();
        }

        // In production, you might want to send this to a logging service
        this.sendToLoggingService(errorInfo, context);
    }

    private sendToLoggingService(errorInfo: ErrorInfo, context?: Record<string, any>): void {
        // Implement your logging service integration here
        // Examples: Sentry, LogRocket, DataDog, etc.
        
        if (!this.isDevelopment) {
            // Example: Send to external logging service
            // loggerService.send({ error: errorInfo, context });
        }
    }
}

export const errorLogger = ErrorLogger.getInstance();

// Helper functions for common error scenarios
export const handleAuthError = (error: any, operation: string): AppError => {
    const authError = new AppError(
        error.message || 'Authentication failed',
        error.code || 'AUTH_ERROR',
        operation
    );
    errorLogger.log(authError, { originalError: error });
    return authError;
};

export const handleFirestoreError = (error: any, operation: string): AppError => {
    const firestoreError = new AppError(
        error.message || 'Database operation failed',
        error.code || 'FIRESTORE_ERROR',
        operation
    );
    errorLogger.log(firestoreError, { originalError: error });
    return firestoreError;
};

export const handleStorageError = (error: any, operation: string): AppError => {
    const storageError = new AppError(
        error.message || 'File operation failed',
        error.code || 'STORAGE_ERROR',
        operation
    );
    errorLogger.log(storageError, { originalError: error });
    return storageError;
};

export const handleNetworkError = (error: any, operation: string): AppError => {
    const networkError = new AppError(
        'Network connection failed',
        'NETWORK_ERROR',
        operation,
        'Please check your internet connection and try again'
    );
    errorLogger.log(networkError, { originalError: error });
    return networkError;
};

export const handleValidationError = (message: string, operation: string): AppError => {
    const validationError = new AppError(
        message,
        'VALIDATION_ERROR',
        operation,
        message
    );
    errorLogger.log(validationError);
    return validationError;
};

// React error boundary helper
export const createErrorBoundary = (fallbackComponent: React.ComponentType<{ error: Error }>) => {
    return class ErrorBoundary extends React.Component<
        { children: React.ReactNode },
        { hasError: boolean; error: Error | null }
    > {
        constructor(props: { children: React.ReactNode }) {
            super(props);
            this.state = { hasError: false, error: null };
        }

        static getDerivedStateFromError(error: Error) {
            return { hasError: true, error };
        }

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
            errorLogger.log(error, { errorInfo });
        }

        render() {
            if (this.state.hasError && this.state.error) {
                const FallbackComponent = fallbackComponent;
                return <FallbackComponent error={this.state.error} />;
            }

            return this.props.children;
        }
    };
};

// Async operation wrapper
export const withErrorHandling = async <T,>(
    operation: () => Promise<T>,
    operationName: string,
    fallbackValue?: T
): Promise<T> => {
    try {
        return await operation();
    } catch (error) {
        const appError = new AppError(
            error instanceof Error ? error.message : 'Unknown error',
            'OPERATION_FAILED',
            operationName
        );
        errorLogger.log(appError, { originalError: error });
        
        if (fallbackValue !== undefined) {
            return fallbackValue;
        }
        
        throw appError;
    }
};

// Type-safe error checking
export const isAppError = (error: unknown): error is AppError => {
    return error instanceof AppError;
};

export const isFirebaseError = (error: unknown): error is { code: string; message: string } => {
    return typeof error === 'object' && 
           error !== null && 
           'code' in error && 
           'message' in error;
};