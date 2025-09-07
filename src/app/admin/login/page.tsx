'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';
import { doc, updateDoc, query, collection, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import AdminLanguageSelector from '@/components/admin/AdminLanguageSelector';
import { getAdminTranslation } from '@/lib/i18n/admin-translations';
import { getAdminLanguage, syncLanguageFromWebsite } from '@/lib/utils/languageCache';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

export default function AdminLogin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');
    const [t, setT] = useState(getAdminTranslation('en'));
    const { toasts, showToast, removeToast, updateToastMessages } = useToast();
    const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

    useEffect(() => {
        const savedLocale = getAdminLanguage() || syncLanguageFromWebsite();
        setCurrentLocale(savedLocale);
        setT(getAdminTranslation(savedLocale));
        
        const registered = searchParams.get('registered');
        const message = searchParams.get('message');
        if (registered === 'true' && message) {
            setRegistrationMessage(decodeURIComponent(message));
        }
        
        const savedUsername = localStorage.getItem('admin_username');
        if (savedUsername) {
            setCredentials(prev => ({ ...prev, username: savedUsername }));
            setRememberMe(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (registrationMessage) {
            showToast(registrationMessage, 'success');
            setRegistrationMessage(null);
        }
    }, [registrationMessage, showToast]);

    const handleLocaleChange = (newLocale: string) => {
        const oldT = t;
        const newT = getAdminTranslation(newLocale);
        
        updateToastMessages((message) => {
            const errorKeys = ['invalidCredentials', 'tooManyAttempts', 'authFailed', 'accountPending', 'accountBlocked'];
            
            for (const key of errorKeys) {
                if (message === oldT.auth.login.errors[key]) {
                    return newT.auth.login.errors[key];
                }
            }
            
            if (message === oldT.auth.register.successMessage) {
                return newT.auth.register.successMessage;
            }
            
            return message;
        });
        
        if (registrationMessage) {
            setRegistrationMessage(newT.auth.register.successMessage);
        }
        
        setCurrentLocale(newLocale);
        setT(newT);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!credentials.username.trim()) {
            showToast(t.auth.login.errors.usernameRequired || 'Username is required', 'error');
            return;
        }
        
        if (!credentials.password) {
            showToast(t.auth.login.errors.passwordRequired || 'Password is required', 'error');
            return;
        }
        
        setLoading(true);

        try {
            const q = query(collection(db, 'admins'), where('username', '==', credentials.username));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                showToast(t.auth.login.errors.invalidCredentials, 'error');
                return;
            }
            
            const adminDoc = querySnapshot.docs[0];
            const adminData = adminDoc.data();
            const adminStatus = adminData.status;
            
            if (adminStatus === 0) {
                showToast(t.auth.login.errors.accountPending, 'error');
                return;
            } else if (adminStatus === 2) {
                showToast(t.auth.login.errors.accountBlocked, 'error');
                return;
            }
            
            const adminEmail = adminData.email || `${credentials.username}@admin.naturjava.local`;
            
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                adminEmail, 
                credentials.password
            );
            
            const token = await userCredential.user.getIdToken();
            document.cookie = `admin-token=${token}; path=/; max-age=3600; secure; samesite=strict`;
            
            if (rememberMe) {
                localStorage.setItem('admin_username', credentials.username);
            } else {
                localStorage.removeItem('admin_username');
            }
            
            await updateDoc(doc(db, 'admins', adminDoc.id), {
                lastLogin: new Date().toISOString()
            }).catch(() => {});
            
            router.push('/admin/dashboard');
        } catch (err: any) {
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                showToast(t.auth.login.errors.invalidCredentials, 'error');
            } else if (err.code === 'auth/too-many-requests') {
                showToast(t.auth.login.errors.tooManyAttempts, 'error');
            } else {
                showToast(t.auth.login.errors.invalidCredentials, 'error');
            }
        } finally {
            setLoading(false);
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-white text-center mb-2">
                        {t.auth.login.title}
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        {t.auth.login.subtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                {t.auth.login.username}
                            </label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                {t.auth.login.password}
                            </label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-green-500 bg-white/10 border border-white/20 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-gray-300 text-sm cursor-pointer">
                                {t.auth.login.rememberMe}
                            </label>
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
                                    {t.auth.login.authenticating}
                                </span>
                            ) : t.auth.login.signIn}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center space-y-3">
                        <p className="text-gray-400 text-sm">
                            {t.auth.login.dontHaveAccount}{' '}
                            <Link href="/admin/register" className="text-green-400 hover:text-green-300 font-medium">
                                {t.auth.login.register}
                            </Link>
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            {t.auth.login.returnToWebsite}
                        </button>
                    </div>
                </div>
            </motion.div>
            </div>
        </div>
    );
}