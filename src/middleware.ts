import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from '@/lib/i18n/config';

const protectedAdminPaths = [
    '/admin/dashboard',
    '/admin/products',
    '/admin/media',
    '/admin/settings'
];

const publicAdminPaths = [
    '/admin/login',
    '/admin/register'
];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('admin-token');
    
    if (pathname.startsWith('/admin')) {
        const isProtectedPath = protectedAdminPaths.some(path => pathname.startsWith(path));
        const isPublicPath = publicAdminPaths.some(path => pathname.startsWith(path));
        
        if (isProtectedPath && !token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        
        if (isPublicPath && token) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        
        if (pathname === '/admin' && !token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        
        if (pathname === '/admin' && token) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        
        return NextResponse.next();
    }
    
    const pathnameHasLocale = locales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale && !pathname.startsWith('/admin')) {
        const siteLanguage = request.cookies.get('site_language')?.value;
        const locale = siteLanguage && locales.includes(siteLanguage as any) 
            ? siteLanguage 
            : defaultLocale;
        return NextResponse.redirect(
            new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};