import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from '@/lib/i18n/config';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const pathnameHasLocale = locales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        const locale = defaultLocale;
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