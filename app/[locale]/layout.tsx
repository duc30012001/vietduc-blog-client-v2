import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import {
    getMessages,
    getTranslations,
    setRequestLocale,
} from 'next-intl/server';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { routing } from '@/i18n/routing';
import { getCategories, getSiteSettings } from '@/libs/api/public';
import { getLocalizedValue } from '@/libs/utils';

import {
    FALLBACK_LOGO,
    FALLBACK_OG_IMAGE,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_URL,
} from '@/libs/constants';

// ==================== Types ====================

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

// ==================== Static Params ====================

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// ==================== Metadata ====================

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const [t, siteSettings] = await Promise.all([
        getTranslations({ locale, namespace: 'metadata' }),
        getSiteSettings(),
    ]);

    const title = t('title');
    const description = t('description');
    const siteTitle = siteSettings.brand.title || SITE_NAME;
    const logo = siteSettings.brand.logo || `${SITE_URL}${FALLBACK_LOGO}`;
    const ogImage = `${SITE_URL}${FALLBACK_OG_IMAGE}`;
    const shortIntro =
        getLocalizedValue(siteSettings.brand, 'shortIntro', locale) ||
        description;

    const alternateLocales = routing.locales.filter((l) => l !== locale);

    return {
        title: {
            default: siteTitle,
            template: `%s | ${siteTitle}`,
        },
        description: shortIntro,
        keywords: SITE_KEYWORDS.split(',').map((k) => k.trim()),
        metadataBase: new URL(SITE_URL),

        // Open Graph
        openGraph: {
            type: 'website',
            locale: locale === 'vi' ? 'vi_VN' : 'en_US',
            alternateLocale: alternateLocales.map((l) =>
                l === 'vi' ? 'vi_VN' : 'en_US',
            ),
            siteName: siteTitle,
            title,
            description: shortIntro,
            url: `${SITE_URL}/${locale}`,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteTitle,
                },
            ],
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            title,
            description: shortIntro,
            images: [ogImage],
        },

        // Icons
        icons: {
            icon: logo,
            apple: logo,
        },

        // Alternate languages
        alternates: {
            canonical: `${SITE_URL}/${locale}`,
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, `${SITE_URL}/${l}`]),
            ),
        },

        // Robots
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

// ==================== Layout ====================

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    setRequestLocale(locale);

    const [messages, siteSettings, categories] = await Promise.all([
        getMessages(),
        getSiteSettings(),
        getCategories(),
    ]);

    return (
        <NextIntlClientProvider messages={messages}>
            <Header brand={siteSettings.brand} categories={categories} />
            <main className="mx-auto min-h-[calc(100vh-var(--header-height))] max-w-(--max-width) px-4 py-8 sm:px-6">
                {children}
            </main>
            <Footer brand={siteSettings.brand} socials={siteSettings.socials} />
        </NextIntlClientProvider>
    );
}
