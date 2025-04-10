'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { motion } from 'framer-motion';
import LanguageSelector from './LanguageSelector';

interface NavigationProps {
    locale: Locale;
    isMobile?: boolean;
    isTransparent?: boolean;
    onNavItemClick?: () => void;
}

export default function Navigation({
    locale,
    isMobile = false,
    isTransparent = false,
    onNavItemClick
}: NavigationProps) {
    const t = getTranslation(locale);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === `/${locale}${path}`;

    const navigationItems = [
        { key: 'home', path: '', label: t.common.menu.home },
        { key: 'company', path: '/company', label: t.common.menu.company },
        { key: 'vinegarStory', path: '/vinegar-story', label: t.common.menu.vinegarStory },
        { key: 'products', path: '/products', label: t.common.menu.products },
        { key: 'support', path: '/support', label: t.common.menu.support },
    ];

    const navVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    const getTextColor = (isActiveItem: boolean) => {
        if (isMobile) return isActiveItem ? 'text-green-600 font-bold' : 'text-gray-800 hover:text-green-600';

        if (!isTransparent) {
            return isActiveItem ? 'text-green-600 font-bold' : 'text-gray-800 hover:text-green-600';
        }

        return isActiveItem ? 'text-green-100 font-bold' : 'text-white hover:text-green-100';
    };

    return (
        <motion.nav
            className={isMobile ? 'flex flex-col space-y-8 items-center' : 'flex items-center space-x-10'}
            variants={navVariants}
            initial="hidden"
            animate="visible"
        >
            {navigationItems.map((item) => (
                <motion.div key={item.key} variants={itemVariants}>
                    <Link
                        href={`/${locale}${item.path}`}
                        onClick={onNavItemClick}
                        className={`${isMobile ? 'text-xl font-medium py-3 block' : 'text-base font-medium'
                            } transition-colors duration-200 relative ${getTextColor(isActive(item.path))}`}
                    >
                        {item.label}
                        {isActive(item.path) && !isMobile && (
                            <motion.span
                                className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600"
                                layoutId="activeNavIndicator"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </Link>
                </motion.div>
            ))}

            <motion.div
                variants={itemVariants}
                className={isMobile ? 'pt-6 w-full max-w-xs' : ''}
            >
                <LanguageSelector locale={locale} isMobile={isMobile} isTransparent={isTransparent} />
            </motion.div>
        </motion.nav>
    );
}