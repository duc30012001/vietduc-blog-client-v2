import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/libs/routes';
import { cn, getLocalizedValue } from '@/libs/utils';

import type { BrandSettings, SocialLink } from '@/libs/types/api';

// ==================== Types ====================

interface FooterProps {
    brand: BrandSettings;
    socials: SocialLink[];
}

// ==================== Main Footer ====================

export function Footer({ brand, socials }: FooterProps) {
    const locale = useLocale();
    const t = useTranslations('footer');
    const currentYear = new Date().getFullYear();

    const shortIntro = getLocalizedValue(brand, 'shortIntro', locale);
    const enabledSocials = socials.filter((s) => s.enabled);

    return (
        <footer className="border-footer-border bg-footer-bg text-footer-text border-t">
            <div className="mx-auto max-w-(--max-width) px-4 py-12 sm:px-6 lg:py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link
                            href={routes.home()}
                            className="group inline-flex items-center gap-2.5"
                        >
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.title}
                                    width={36}
                                    height={36}
                                    className="h-9 w-9 rounded-lg object-contain transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="bg-accent flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white">
                                    {brand.title.charAt(0)}
                                </div>
                            )}
                            <span className="text-footer-heading text-lg font-semibold">
                                {brand.title}
                            </span>
                        </Link>

                        {shortIntro && (
                            <p className="text-footer-text mt-4 max-w-sm leading-relaxed">
                                {shortIntro}
                            </p>
                        )}
                    </div>

                    {/* Get In Touch Column */}
                    <div>
                        <h3 className="text-footer-heading mb-4 font-semibold tracking-wider uppercase">
                            {t('getInTouch')}
                        </h3>

                        {brand.contactEmail && (
                            <a
                                href={`mailto:${brand.contactEmail}`}
                                className={cn(
                                    'text-footer-text inline-flex items-center gap-2 transition-colors',
                                    'hover:text-accent',
                                )}
                            >
                                <svg
                                    className="h-4 w-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
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
                    </div>

                    {/* Follow Me Column */}
                    {enabledSocials.length > 0 && (
                        <div>
                            <h3 className="text-footer-heading mb-4 font-semibold tracking-wider uppercase">
                                {t('followMe')}
                            </h3>

                            <div className="flex flex-wrap gap-2.5">
                                {enabledSocials.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={social.name}
                                        className={cn(
                                            'border-footer-border text-footer-text flex h-10 w-10 items-center justify-center rounded-lg border transition-all',
                                            'hover:border-accent/40 hover:bg-accent/10 hover:text-accent hover:scale-110',
                                        )}
                                    >
                                        {social.logo ? (
                                            <Image
                                                src={social.logo}
                                                alt={social.name}
                                                width={20}
                                                height={20}
                                                className="h-5 w-5 object-contain"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium">
                                                {social.name
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-footer-border border-t">
                <div className="mx-auto max-w-(--max-width) px-4 py-5 sm:px-6">
                    <p className="text-text-muted text-center text-sm">
                        {t('copyright', {
                            year: currentYear,
                            name: brand.title,
                        })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
