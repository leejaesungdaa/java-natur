'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Globe, ChevronLeft, ChevronRight,
    LogOut, Menu, X
} from 'lucide-react';
import AdminLanguageSelector from '@/components/admin/AdminLanguageSelector';
import { getAdminTranslation } from '@/lib/i18n/admin-translations';
import { getAdminLanguage, syncLanguageFromWebsite } from '@/lib/utils/languageCache';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    badge?: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarOpen');
            return saved !== null ? saved === 'true' : true;
        }
        return true;
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');
    const [t, setT] = useState(getAdminTranslation('en'));
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLocale = getAdminLanguage() || syncLanguageFromWebsite();
        setCurrentLocale(savedLocale);
        setT(getAdminTranslation(savedLocale));
        setMounted(true);
        setCurrentTime(new Date());
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('sidebarOpen', String(sidebarOpen));
        }
    }, [sidebarOpen, mounted]);

    useEffect(() => {
        if (!mounted) return;
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, [mounted]);

    const handleLocaleChange = (newLocale: string) => {
        setCurrentLocale(newLocale);
        setT(getAdminTranslation(newLocale));
    };

    const formatIndonesiaTime = () => {
        if (!currentTime) return { dateTime: '' };
        
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const formatter = new Intl.DateTimeFormat(currentLocale === 'ko' ? 'ko-KR' : 
                                                   currentLocale === 'id' ? 'id-ID' : 
                                                   currentLocale === 'zh' ? 'zh-CN' : 
                                                   currentLocale === 'ja' ? 'ja-JP' : 
                                                   currentLocale === 'ar' ? 'ar-SA' : 'en-US', options);
        
        const parts = formatter.formatToParts(currentTime);
        const date = `${parts.find(p => p.type === 'year')?.value}.${parts.find(p => p.type === 'month')?.value}.${parts.find(p => p.type === 'day')?.value}`;
        const weekday = parts.find(p => p.type === 'weekday')?.value;
        const time = `${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}:${parts.find(p => p.type === 'second')?.value}`;
        
        return { dateTime: `${date} (${weekday})  ${time}` };
    };

    const { dateTime } = formatIndonesiaTime();

    const menuItems: MenuItem[] = [
        { icon: <LayoutDashboard size={20} />, label: t.navigation?.dashboard || 'Dashboard', path: '/admin/dashboard' },
        { icon: <Users size={20} />, label: t.navigation?.employeeManagement || 'Employee Management', path: '/admin/employees' },
        { icon: <Globe size={20} />, label: t.navigation?.websiteManagement || 'Website Management', path: '/admin/website' }
    ];

    const handleLogout = async () => {
        document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin_username');
        sessionStorage.clear();
        await signOut({ redirect: false });
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <motion.aside
                initial={{ width: sidebarOpen ? 256 : 72 }}
                animate={{ width: sidebarOpen ? 256 : 72 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:block fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl z-40"
            >
                <div className="h-full flex flex-col">
                    <div className="relative h-16 border-b border-gray-700">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`absolute ${sidebarOpen ? 'right-3' : 'left-1/2 -translate-x-1/2'} top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all group`}
                        >
                            <div className="relative">
                                {sidebarOpen ? <ChevronLeft size={18} className="text-gray-300 group-hover:text-white" /> : <ChevronRight size={18} className="text-gray-300 group-hover:text-white" />}
                            </div>
                        </button>
                    </div>

                    <nav className="flex-1 p-3 space-y-2">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.path}
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <button
                                    onClick={() => router.push(item.path)}
                                    className={`w-full flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} px-3 py-3 rounded-lg transition-all group relative overflow-hidden ${
                                        pathname === item.path
                                            ? 'bg-gradient-to-r from-green-500/20 to-blue-600/20'
                                            : 'hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`flex items-center ${sidebarOpen ? 'gap-3' : ''}`}>
                                        <div className={`p-2 rounded-lg transition-all ${
                                            pathname === item.path 
                                                ? 'bg-gradient-to-r from-green-500 to-blue-600 shadow-lg' 
                                                : 'group-hover:bg-white/10'
                                        }`}>
                                            <span className="text-white">
                                                {item.icon}
                                            </span>
                                        </div>
                                        {sidebarOpen && (
                                            <motion.span 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-sm font-medium"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </div>
                                    {sidebarOpen && item.badge && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-red-500 text-xs px-2 py-1 rounded-full"
                                        >
                                            {item.badge}
                                        </motion.span>
                                    )}
                                </button>
                                {!sidebarOpen && pathname === item.path && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: 3 }}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-r-full"
                                    />
                                )}
                                {!sidebarOpen && (
                                    <AnimatePresence>
                                        {item.badge && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                                            />
                                        )}
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        ))}
                    </nav>

                    <div className="p-3 border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} px-3 py-3 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white group`}
                        >
                            <div className="p-2 rounded-lg group-hover:bg-white/10 transition-all">
                                <LogOut size={20} />
                            </div>
                            {sidebarOpen && (
                                <span className="text-sm font-medium">{t.navigation?.logout || 'Logout'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.aside>

            <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'} transition-all duration-300`}>
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            
                            {mounted && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-semibold text-gray-900 tracking-wide">{dateTime}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.open('/', '_blank')}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                                title={t.navigation?.goToWebsite || 'Go to Website'}
                            >
                                <Globe size={18} />
                                <span className="hidden sm:block text-sm font-medium">{t.navigation?.website || 'Website'}</span>
                            </button>
                            <AdminLanguageSelector 
                                currentLocale={currentLocale}
                                onLocaleChange={handleLocaleChange}
                            />
                        </div>
                    </div>
                </header>

                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:hidden fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50"
                    >
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-xl font-bold">
                                    {t.navigation?.menu || 'Menu'}
                                </h1>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => {
                                            router.push(item.path);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                                            pathname === item.path
                                                ? 'bg-gradient-to-r from-green-500/20 to-blue-600/20'
                                                : 'hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                pathname === item.path 
                                                    ? 'bg-gradient-to-r from-green-500 to-blue-600' 
                                                    : ''
                                            }`}>
                                                {item.icon}
                                            </div>
                                            <span>{item.label}</span>
                                        </div>
                                        {item.badge && (
                                            <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>

                            <div className="border-t border-gray-700 pt-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                                >
                                    <LogOut size={20} />
                                    <span className="text-sm font-medium">{t.navigation?.logout || 'Logout'}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}