import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

import { MarkdownRenderer } from '@/components/markdown-renderer';
import { getSiteSettings } from '@/libs/api/public';
import { SITE_NAME, SITE_URL } from '@/libs/constants';
import { cn } from '@/libs/utils';

// ==================== Types ====================

type Props = {
    params: Promise<{ locale: string }>;
};

// ==================== Metadata ====================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'header' });

    return {
        title: t('about'),
        alternates: {
            canonical: `${SITE_URL}/${locale}/about`,
        },
        openGraph: {
            title: `${t('about')} | ${SITE_NAME}`,
            siteName: SITE_NAME,
            url: `${SITE_URL}/${locale}/about`,
        },
    };
}

// ==================== Page ====================

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;

    setRequestLocale(locale);

    const siteSettings = await getSiteSettings();
    const brand = siteSettings?.brand;

    const shortIntro =
        locale === 'vi' ? brand?.shortIntroVi : brand?.shortIntroEn;
    const fullIntro = locale === 'vi' ? brand?.fullIntroVi : brand?.fullIntroEn;

    const enabledSocials =
        siteSettings?.socials?.filter((s) => s.enabled) ?? [];

    return (
        <div className="mx-auto max-w-4xl">
            {/* ======== Hero Profile Section ======== */}
            <section className="relative mb-16 overflow-hidden rounded-3xl">
                {/* Gradient Background */}
                <div className="from-accent/10 via-accent/5 to-background absolute inset-0 bg-gradient-to-br" />
                <div className="bg-accent/5 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl" />
                <div className="bg-accent/5 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl" />

                <div className="relative flex flex-col items-center px-8 py-16 text-center sm:py-20">
                    {/* Avatar */}
                    {brand?.logo && (
                        <div className="ring-accent/20 mb-6 overflow-hidden rounded-full ring-4 ring-offset-4 ring-offset-transparent">
                            <Image
                                src={brand.logo}
                                alt={brand.title}
                                width={120}
                                height={120}
                                className="h-[120px] w-[120px] rounded-full object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Name */}
                    <h1 className="text-text-primary mb-3 text-3xl font-bold sm:text-4xl">
                        {brand?.title || SITE_NAME}
                    </h1>

                    {/* Short Intro */}
                    {shortIntro && (
                        <p className="text-text-secondary mx-auto max-w-xl text-lg leading-relaxed">
                            {shortIntro}
                        </p>
                    )}

                    {/* Contact Email */}
                    {brand?.contactEmail && (
                        <a
                            href={`mailto:${brand.contactEmail}`}
                            className={cn(
                                'mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5',
                                'bg-accent font-medium text-white',
                                'hover:bg-accent/90 transition-colors',
                                'shadow-accent/25 shadow-lg',
                            )}
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                />
                            </svg>
                            {brand.contactEmail}
                        </a>
                    )}

                    {/* Social Links */}
                    {enabledSocials.length > 0 && (
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {enabledSocials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'flex items-center gap-2 rounded-full px-4 py-2',
                                        'bg-surface border-border border',
                                        'text-text-secondary text-sm font-medium',
                                        'hover:border-accent hover:text-accent transition-colors',
                                    )}
                                >
                                    {social.logo && (
                                        <Image
                                            src={social.logo}
                                            alt={social.name}
                                            width={18}
                                            height={18}
                                            className="h-[18px] w-[18px] rounded-sm object-contain"
                                        />
                                    )}
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ======== Full Intro Content ======== */}
            {fullIntro && (
                <section className="mx-auto max-w-3xl">
                    <MarkdownRenderer
                        content={fullIntro}
                        className="prose-lg max-w-none"
                    />
                </section>
            )}
        </div>
    );
}
