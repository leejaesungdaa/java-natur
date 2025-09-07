export type ValidationErrorKey = 
    | 'usernameRequired'
    | 'usernameLength'
    | 'usernameNoKorean'
    | 'usernameFormat'
    | 'usernameMustContain'
    | 'passwordRequired'
    | 'passwordMinLength'
    | 'passwordMustContainLetter'
    | 'passwordMustContainSpecial'
    | 'nameRequired'
    | 'nameLength'
    | 'nameInvalidKorean'
    | 'nameNoSpecialChars'
    | 'nameNoNumbers'
    | 'nameInvalidFormat';

export const validateUsername = (username: string): { isValid: boolean; errorKey?: ValidationErrorKey } => {
    if (!username) {
        return { isValid: false, errorKey: 'usernameRequired' };
    }
    
    if (username.length < 4 || username.length > 20) {
        return { isValid: false, errorKey: 'usernameLength' };
    }
    
    const hasEnglish = /[a-zA-Z]/.test(username);
    const hasNumber = /[0-9]/.test(username);
    const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(username);
    const hasInvalidChars = /[^a-zA-Z0-9_]/.test(username);
    
    if (hasKorean) {
        return { isValid: false, errorKey: 'usernameNoKorean' };
    }
    
    if (hasInvalidChars) {
        return { isValid: false, errorKey: 'usernameFormat' };
    }
    
    if (!hasEnglish || !hasNumber) {
        return { isValid: false, errorKey: 'usernameMustContain' };
    }
    
    return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; errorKey?: ValidationErrorKey } => {
    if (!password) {
        return { isValid: false, errorKey: 'passwordRequired' };
    }
    
    if (password.length < 6) {
        return { isValid: false, errorKey: 'passwordMinLength' };
    }
    
    const hasEnglish = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasEnglish) {
        return { isValid: false, errorKey: 'passwordMustContainLetter' };
    }
    
    if (!hasSpecialChar) {
        return { isValid: false, errorKey: 'passwordMustContainSpecial' };
    }
    
    return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; errorKey?: ValidationErrorKey } => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, errorKey: 'nameRequired' };
    }
    
    if (name.length < 2 || name.length > 50) {
        return { isValid: false, errorKey: 'nameLength' };
    }
    
    const hasIncompleteKorean = /[ㄱ-ㅎㅏ-ㅣ]/.test(name);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;`~]/.test(name);
    const hasNumbers = /[0-9]/.test(name);
    
    if (hasIncompleteKorean) {
        return { isValid: false, errorKey: 'nameInvalidKorean' };
    }
    
    if (hasSpecialChars) {
        return { isValid: false, errorKey: 'nameNoSpecialChars' };
    }
    
    if (hasNumbers) {
        return { isValid: false, errorKey: 'nameNoNumbers' };
    }
    
    const validNamePattern = /^[a-zA-Z가-힣\s]+$/;
    if (!validNamePattern.test(name)) {
        return { isValid: false, errorKey: 'nameInvalidFormat' };
    }
    
    return { isValid: true };
};