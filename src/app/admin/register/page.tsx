'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebaseConfig';
import { validateUsername, validatePassword, validateName } from '@/lib/auth/validators';
import AdminLanguageSelector from '@/components/admin/AdminLanguageSelector';
import { getAdminTranslation } from '@/lib/i18n/admin-translations';
import { getAdminLanguage, syncLanguageFromWebsite } from '@/lib/utils/languageCache';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import bcrypt from 'bcryptjs';
import { getIndonesiaTime } from '@/lib/utils/dateUtils';

export default function AdminRegister() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');
    const [t, setT] = useState(getAdminTranslation('en'));
    const { toasts, showToast, removeToast, updateToastMessages } = useToast();

    useEffect(() => {
        const savedLocale = getAdminLanguage() || syncLanguageFromWebsite();
        setCurrentLocale(savedLocale);
        setT(getAdminTranslation(savedLocale));
    }, []);

    const handleLocaleChange = (newLocale: string) => {
        const oldT = t;
        const newT = getAdminTranslation(newLocale);
        
        updateToastMessages((message) => {
            const errorKeys = [
                'authFailed',
                'usernameRequired', 'nameRequired', 'passwordRequired',
                'confirmPasswordRequired', 'passwordMismatch', 'usernameExists',
                'nameInvalid', 'usernameInvalid', 'passwordInvalid'
            ] as const;
            
            for (const key of errorKeys) {
                if (message === oldT.auth.register.errors[key]) {
                    return newT.auth.register.errors[key];
                }
            }
            
            const validationKeys = [
                'usernameRequired', 'usernameLength', 'usernameFormat',
                'usernameMustContain', 'usernameNoKorean',
                'passwordRequired', 'passwordMinLength',
                'passwordMustContainLetter', 'passwordMustContainSpecial',
                'nameRequired', 'nameLength', 'nameInvalidKorean',
                'nameNoSpecialChars', 'nameNoNumbers', 'nameInvalidFormat'
            ] as const;
            
            for (const key of validationKeys) {
                if (key in oldT.auth.login.validation) {
                    if (message === oldT.auth.login.validation[key as keyof typeof oldT.auth.login.validation]) {
                        return newT.auth.login.validation[key as keyof typeof newT.auth.login.validation];
                    }
                }
            }
            
            if (message === oldT.auth.register.successMessage) {
                return newT.auth.register.successMessage;
            }
            
            return message;
        });
        
        setCurrentLocale(newLocale);
        setT(newT);
    };

    const generateEmailFromUsername = (username: string): string => {
        return `${username}@admin.naturjava.local`;
    };

    const validateForm = async () => {
        if (!formData.name.trim()) {
            showToast(t.auth.register.errors.nameRequired, 'error');
            return false;
        }
        
        const nameValidation = validateName(formData.name);
        if (!nameValidation.isValid && nameValidation.errorKey) {
            const errorMessage = (t.auth.login.validation as any)[nameValidation.errorKey];
            if (errorMessage) {
                showToast(errorMessage, 'error');
            } else {
                showToast(t.auth.register.errors.nameInvalid, 'error');
            }
            return false;
        }

        if (!formData.username.trim()) {
            showToast(t.auth.register.errors.usernameRequired, 'error');
            return false;
        }

        const usernameValidation = validateUsername(formData.username);
        if (!usernameValidation.isValid && usernameValidation.errorKey) {
            const errorMessage = (t.auth.login.validation as any)[usernameValidation.errorKey];
            if (errorMessage) {
                showToast(errorMessage, 'error');
            } else {
                showToast(t.auth.register.errors.usernameInvalid, 'error');
            }
            return false;
        }
        
        try {
            const response = await fetch('/api/auth/check-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.username })
            });
            
            if (response.ok) {
                const { available } = await response.json();
                if (!available) {
                    showToast(t.auth.register.errors.usernameExists, 'error');
                    return false;
                }
            }
        } catch (error) {
            // Username availability check failed, proceed with validation
        }
        
        if (!formData.password) {
            showToast(t.auth.register.errors.passwordRequired, 'error');
            return false;
        }
        
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid && passwordValidation.errorKey) {
            const errorMessage = (t.auth.login.validation as any)[passwordValidation.errorKey];
            if (errorMessage) {
                showToast(errorMessage, 'error');
            } else {
                showToast(t.auth.register.errors.passwordInvalid, 'error');
            }
            return false;
        }
        
        if (!formData.confirmPassword) {
            showToast(t.auth.register.errors.confirmPasswordRequired, 'error');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            showToast(t.auth.register.errors.passwordMismatch, 'error');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const isValid = await validateForm();
        if (!isValid) return;
        
        setLoading(true);

        try {
            const generatedEmail = generateEmailFromUsername(formData.username);
            
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                generatedEmail,
                formData.password
            );

            try {
                await updateProfile(userCredential.user, {
                    displayName: formData.name
                });
            } catch (profileError) {
                // Profile update error (non-critical), continue with registration
            }

            try {
                const hashedPassword = await bcrypt.hash(formData.password, 10);
                
                await setDoc(doc(db, 'admins', userCredential.user.uid), {
                    name: formData.name,
                    username: formData.username,
                    email: generatedEmail,
                    password: hashedPassword,
                    role: 'admin',
                    status: 0,
                    createdAt: getIndonesiaTime(),
                    approvedAt: null,
                    blockedAt: null,
                    lastLogin: null,
                    permissions: {
                        employeeManagement: false,
                        websiteManagement: false,
                        dashboard: true,  // 대시보드는 기본적으로 접근 가능
                        media: false
                    }
                });
            } catch (firestoreError: any) {
                // Firestore write error - account created but details not saved
                // This is acceptable as the Firebase Auth account was created successfully
            }

            setLoading(false);
            router.push(`/admin/login?registered=true&message=${encodeURIComponent(t.auth.register.successMessage)}`);
        } catch (err: any) {
            
            if (err.code === 'auth/email-already-in-use') {
                showToast(t.auth.register.errors.usernameExists, 'error');
            } else if (err.code === 'auth/weak-password') {
                showToast(t.auth.register.errors.passwordInvalid, 'error');
            } else {
                showToast(t.auth.register.errors.authFailed, 'error');
            }
            setLoading(false);``
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            
            <div className="flex justify-end p-4">
                <AdminLanguageSelector 
                    currentLocale={currentLocale}
                    onLocaleChange={handleLocaleChange}
                    variant="white"
                />
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                        <div className="flex justify-center mb-8">
                            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-white text-center mb-2">
                            {t.auth.register.title}
                        </h1>
                        <p className="text-gray-400 text-center mb-8">
                            {t.auth.register.subtitle}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    {t.auth.register.fullName}
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    {t.auth.register.username} <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    {t.auth.register.password} <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    {t.auth.register.confirmPassword}
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t.auth.register.creatingAccount}
                                    </span>
                                ) : t.auth.register.createAccount}
                            </motion.button>
                        </form>

                        <div className="mt-8 text-center space-y-3">
                            <p className="text-gray-400 text-sm">
                                {t.auth.register.haveAccount}{' '}
                                <Link href="/admin/login" className="text-green-400 hover:text-green-300 font-medium">
                                    {t.auth.register.signIn}
                                </Link>
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="text-gray-400 hover:text-white transition-colors text-sm"
                            >
                                {t.auth.register.returnToWebsite}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}