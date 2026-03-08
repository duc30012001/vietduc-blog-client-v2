import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { NuqsProvider } from '@/components/nuqs-provider';
import { SITE_NAME } from '@/libs/constants';

import './globals.css';

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: 'A blog about technology, programming, and life',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`${geistMono.variable} antialiased`}>
                <NextTopLoader showSpinner={false} />
                <NuqsProvider>{children}</NuqsProvider>
            </body>

            {process.env.NEXT_PUBLIC_GA_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
        </html>
    );
}
