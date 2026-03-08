import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { routing } from '@/i18n/routing';
import { getCategories, getSiteSettings } from '@/libs/api/public';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

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
