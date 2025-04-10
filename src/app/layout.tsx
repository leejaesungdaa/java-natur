import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NATUR JAVA',
  description: 'CV. SIYUN JAYA - NATUR JAVA offers premium quality vinegar products made with natural ingredients from Java island.',
  keywords: ['vinegar', 'natural vinegar', 'natur java', 'apple cider vinegar', 'java', 'indonesia', 'organic', 'health'],
  authors: [{ name: 'CV. SIYUN JAYA' }],
  creator: 'CV. SIYUN JAYA',
  metadataBase: new URL('https://naturjava.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://naturjava.com',
    siteName: 'NATUR JAVA',
    title: 'NATUR JAVA',
    description: 'Premium quality vinegar products made with natural ingredients from Java island.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NATUR JAVA'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NATUR JAVA',
    description: 'Premium quality vinegar products made with natural ingredients from Java island.',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}