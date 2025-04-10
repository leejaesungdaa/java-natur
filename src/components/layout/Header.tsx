'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, getTranslation } from '@/lib/i18n/config';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const t = getTranslation(locale);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isTransparent
        ? 'bg-transparent py-5'
        : 'bg-white/95 backdrop-blur-sm shadow-sm py-3'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/${locale}`} className="flex items-center">
            {/* 이미지 경로 확인 및 기본 로고 사용 */}
            <Image
              src={isTransparent ? "/images/logo-white.png" : "/images/logo.png"}
              alt="NATUR JAVA"
              width={140}
              height={45}
              className="h-10 w-auto object-contain"
              priority={true}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/logo.png";
              }}
            />
          </Link>
        </motion.div>

        <div className="hidden md:block">
          <Navigation locale={locale} isTransparent={isTransparent} />
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`z-50 p-2 rounded-md focus:outline-none ${isTransparent ? 'text-white' : 'text-gray-800'
              }`}
            aria-label="Toggle menu"
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
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 bg-white z-40 pt-20"
          >
            <div className="container mx-auto px-6 py-10">
              <Navigation
                locale={locale}
                isMobile={true}
                isTransparent={false}
                onNavItemClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}