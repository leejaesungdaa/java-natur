'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, getTranslation } from '@/lib/i18n/config';
import Navigation from './Navigation';
import LanguageSelector from './LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteImages } from '@/hooks/useFirebase';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const t = getTranslation(locale);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { images, loading } = useSiteImages();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  const logo = loading ? "/images/logo.png" : (images.logo || "/images/logo.png");

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent py-5' : 'bg-white/95 backdrop-blur-sm shadow-sm py-3'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src={logo}
              alt="Java Natur"
              width={140}
              height={45}
              className={`h-10 w-auto object-contain ${isTransparent ? 'brightness-0 invert' : ''}`}
              priority={true}
            />
          </Link>
        </motion.div>

        <div className="hidden md:block">
          <Navigation locale={locale} isTransparent={isTransparent} />
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`p-2 rounded-full transition-all duration-300 focus:outline-none ${isTransparent
              ? 'text-white hover:bg-white/10'
              : 'text-gray-800 hover:bg-gray-100'
              }`}
            aria-label="Open menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                mass: 0.8
              }}
              className="bg-white max-h-[92vh] w-full rounded-b-3xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Image
                    src={logo}
                    alt="Java Natur"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="p-6 border-b border-gray-100">
                <div className="max-w-[240px] mx-auto">
                  <LanguageSelector locale={locale} isMobile={true} isTransparent={false} />
                </div>
              </div>

              <motion.div
                className="flex-1 overflow-y-auto py-4 pb-8"
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.2
                    }
                  },
                  closed: {
                    transition: {
                      staggerChildren: 0.05,
                      staggerDirection: -1
                    }
                  }
                }}
              >
                <MobileNavigation
                  locale={locale}
                  onNavItemClick={() => setIsMobileMenuOpen(false)}
                />
              </motion.div>

              <div className="p-6 bg-gray-50">
                <div className="flex justify-center space-x-10">
                  <SocialIcon href="#" type="facebook" />
                  <SocialIcon href="#" type="instagram" />
                  <SocialIcon href="#" type="twitter" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

interface MobileNavigationProps {
  locale: Locale;
  onNavItemClick: () => void;
}

function MobileNavigation({ locale, onNavItemClick }: MobileNavigationProps) {
  const t = getTranslation(locale);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  const menuItems = [
    { key: 'home', path: '', label: t.common.menu.home, icon: 'home' },
    { key: 'company', path: '/company', label: t.common.menu.company, icon: 'building' },
    { key: 'vinegarInfo', path: '/vinegar-info', label: t.common.menu.vinegarInfo, icon: 'info' },
    { key: 'vinegarStory', path: '/vinegar-story', label: t.common.menu.vinegarStory, icon: 'book' },
    { key: 'products', path: '/products', label: t.common.menu.products, icon: 'shopping' },
    { key: 'support', path: '/support', label: t.common.menu.support, icon: 'support' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'home':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'building':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'book':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'shopping':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'support':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const menuItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="px-6">
      {menuItems.map((item) => (
        <motion.div
          key={item.key}
          variants={menuItemVariants}
          className="mb-2">
          <Link
            href={`/${locale}${item.path}`}
            onClick={onNavItemClick}
            className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-200 ${isActive(item.path)
              ? 'bg-green-50 text-green-700 shadow-sm'
              : 'hover:bg-gray-50 text-gray-700'
              }`}>
            <span className={`mr-4 ${isActive(item.path) ? 'text-green-600' : 'text-gray-500'}`}>
              {getIcon(item.icon)}
            </span>
            <span className="text-lg font-medium">{item.label}</span>
            {isActive(item.path) && (
              <motion.span
                className="ml-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}>
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </motion.span>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

interface SocialIconProps {
  href: string;
  type: 'facebook' | 'instagram' | 'twitter';
}

function SocialIcon({ href, type }: SocialIconProps) {
  const getIcon = () => {
    switch (type) {
      case 'facebook':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        );
    }
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-green-600 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}>
      {getIcon()}
    </motion.a>
  );
}