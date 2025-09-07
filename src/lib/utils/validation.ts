// Comprehensive validation utilities with TypeScript support

export interface ValidationResult {
    isValid: boolean;
    errorKey?: string;
    message?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
    if (!email || email.trim().length === 0) {
        return { isValid: false, errorKey: 'emailRequired', message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, errorKey: 'invalidEmail', message: 'Please enter a valid email address' };
    }

    if (email.length > 254) {
        return { isValid: false, errorKey: 'emailTooLong', message: 'Email address is too long' };
    }

    return { isValid: true };
};

// Username validation
export const validateUsername = (username: string): ValidationResult => {
    if (!username || username.trim().length === 0) {
        return { isValid: false, errorKey: 'usernameRequired', message: 'Username is required' };
    }

    if (username.length < 4 || username.length > 20) {
        return { isValid: false, errorKey: 'usernameLength', message: 'Username must be between 4 and 20 characters' };
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, errorKey: 'usernameFormat', message: 'Username can only contain letters, numbers, and underscores' };
    }

    const hasLetter = /[a-zA-Z]/.test(username);
    const hasNumber = /[0-9]/.test(username);
    
    if (!hasLetter || !hasNumber) {
        return { isValid: false, errorKey: 'usernameMustContain', message: 'Username must contain both letters and numbers' };
    }

    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(username)) {
        return { isValid: false, errorKey: 'usernameNoKorean', message: 'Korean characters are not allowed' };
    }

    return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
    if (!password || password.length === 0) {
        return { isValid: false, errorKey: 'passwordRequired', message: 'Password is required' };
    }

    if (password.length < 6) {
        return { isValid: false, errorKey: 'passwordMinLength', message: 'Password must be at least 6 characters long' };
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasLetter) {
        return { isValid: false, errorKey: 'passwordMustContainLetter', message: 'Password must contain at least one letter' };
    }

    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecial) {
        return { isValid: false, errorKey: 'passwordMustContainSpecial', message: 'Password must contain at least one special character' };
    }

    return { isValid: true };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, errorKey: 'nameRequired', message: 'Name is required' };
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return { isValid: false, errorKey: 'nameLength', message: 'Name must be between 2 and 50 characters' };
    }

    // Check for numbers
    if (/\d/.test(trimmedName)) {
        return { isValid: false, errorKey: 'nameNoNumbers', message: 'Name cannot contain numbers' };
    }

    // Check for special characters (except spaces, hyphens, and apostrophes)
    const allowedSpecialChars = /^[a-zA-Z가-힣\s'-]+$/;
    if (!allowedSpecialChars.test(trimmedName)) {
        return { isValid: false, errorKey: 'nameNoSpecialChars', message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    // Validate Korean characters (basic check)
    const koreanChars = trimmedName.match(/[가-힣]/g);
    if (koreanChars) {
        const invalidKorean = /[ㄱ-ㅎㅏ-ㅣ]/.test(trimmedName); // Incomplete Korean characters
        if (invalidKorean) {
            return { isValid: false, errorKey: 'nameInvalidKorean', message: 'Invalid Korean characters detected' };
        }
    }

    return { isValid: true };
};

// Phone number validation
export const validatePhoneNumber = (phone: string): ValidationResult => {
    if (!phone || phone.trim().length === 0) {
        return { isValid: false, errorKey: 'phoneRequired', message: 'Phone number is required' };
    }

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return { isValid: false, errorKey: 'phoneInvalidLength', message: 'Phone number must be between 10 and 15 digits' };
    }

    return { isValid: true };
};

// URL validation
export const validateURL = (url: string): ValidationResult => {
    if (!url || url.trim().length === 0) {
        return { isValid: false, errorKey: 'urlRequired', message: 'URL is required' };
    }

    try {
        new URL(url);
        return { isValid: true };
    } catch {
        return { isValid: false, errorKey: 'invalidURL', message: 'Please enter a valid URL' };
    }
};

// File validation
export const validateFile = (
    file: File, 
    options: {
        maxSize?: number; // in bytes
        allowedTypes?: string[];
        minSize?: number;
    } = {}
): ValidationResult => {
    const { maxSize = 50 * 1024 * 1024, allowedTypes = [], minSize = 0 } = options; // Default 50MB max

    if (!file) {
        return { isValid: false, errorKey: 'fileRequired', message: 'Please select a file' };
    }

    if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        return { 
            isValid: false, 
            errorKey: 'fileTooLarge', 
            message: `File size must be less than ${maxSizeMB}MB` 
        };
    }

    if (file.size < minSize) {
        return { isValid: false, errorKey: 'fileTooSmall', message: 'File is too small' };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return { 
            isValid: false, 
            errorKey: 'fileTypeNotAllowed', 
            message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
        };
    }

    return { isValid: true };
};

// Form validation helper
export type FormValidationRules<T> = {
    [K in keyof T]?: (value: T[K]) => ValidationResult;
}

export interface FormValidationResult<T> {
    isValid: boolean;
    errors: Partial<Record<keyof T, string>>;
    errorKeys: Partial<Record<keyof T, string>>;
}

export const validateForm = <T extends Record<string, any>>(
    data: T,
    rules: FormValidationRules<T>
): FormValidationResult<T> => {
    const errors: Partial<Record<keyof T, string>> = {};
    const errorKeys: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const [field, validator] of Object.entries(rules)) {
        if (validator && typeof validator === 'function') {
            const result = validator(data[field as keyof T]);
            if (!result.isValid) {
                errors[field as keyof T] = result.message || 'Invalid value';
                errorKeys[field as keyof T] = result.errorKey || 'invalid';
                isValid = false;
            }
        }
    }

    return { isValid, errors, errorKeys };
};

// Sanitization utilities
export const sanitizeString = (str: string): string => {
    return str.trim().replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

export const sanitizePhone = (phone: string): string => {
    // Keep only digits, plus, and hyphens
    return phone.replace(/[^\d+\-\s()]/g, '');
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
    score: number; // 0-4
    feedback: string[];
    strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
} => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push('Add special characters');

    const strengthLevels = ['very-weak', 'weak', 'fair', 'good', 'strong'] as const;
    const strength = strengthLevels[Math.min(score, 4)];

    return { score, feedback, strength };
};

// Async validation utility
export const asyncValidation = async <T>(
    validator: () => Promise<ValidationResult>,
    timeout: number = 5000
): Promise<ValidationResult> => {
    try {
        const timeoutPromise = new Promise<ValidationResult>((_, reject) => {
            setTimeout(() => reject(new Error('Validation timeout')), timeout);
        });

        const result = await Promise.race([validator(), timeoutPromise]);
        return result;
    } catch (error) {
        return {
            isValid: false,
            errorKey: 'validationTimeout',
            message: 'Validation timed out. Please try again.'
        };
    }
};

// Validation schema builder
export class ValidationSchema<T extends Record<string, any>> {
    private rules: FormValidationRules<T> = {};

    field<K extends keyof T>(fieldName: K, validator: (value: T[K]) => ValidationResult): this {
        this.rules[fieldName] = validator;
        return this;
    }

    validate(data: T): FormValidationResult<T> {
        return validateForm(data, this.rules);
    }
}

// Helper to create validation schema
export const createValidationSchema = <T extends Record<string, any>>() => {
    return new ValidationSchema<T>();
};