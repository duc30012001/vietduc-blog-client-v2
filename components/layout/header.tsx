'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { routes } from '@/libs/routes';
import { cn, getLocalizedValue } from '@/libs/utils';

import type { BrandSettings, Category } from '@/libs/types/api';

// ==================== Types ====================

interface HeaderProps {
    brand: BrandSettings;
    categories: Category[];
}

// ==================== Sub-components ====================

function CategoryDropdown({
    category,
    locale,
    depth = 0,
}: {
    category: Category;
    locale: string;
    depth?: number;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const name = getLocalizedValue(category, 'name_', locale);
    const hasChildren = category.children && category.children.length > 0;

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    };

    if (!hasChildren) {
        return (
            <Link
                href={routes.category(category.slug)}
                className={cn(
                    'text-text-secondary block px-4 py-2.5 transition-colors',
                    'hover:bg-surface-hover hover:text-accent',
                    depth > 0 && 'pl-6',
                )}
            >
                {name}
            </Link>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={routes.category(category.slug)}
                className={cn(
                    'text-text-secondary flex items-center gap-1.5 px-4 py-2.5 transition-colors',
                    'hover:bg-surface-hover hover:text-accent',
                    depth === 0 && 'font-medium',
                    depth > 0 && 'pl-6',
                )}
            >
                {name}
                <svg
                    className="h-3.5 w-3.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </Link>

            {isOpen && (
                <div
                    className={cn(
                        'border-border bg-background absolute z-50 min-w-[200px] rounded-lg border py-1 shadow-lg',
                        depth === 0
                            ? 'top-full left-0 mt-1'
                            : 'top-0 left-full ml-1',
                    )}
                >
                    {category.children!.map((child) => (
                        <CategoryDropdown
                            key={child.id}
                            category={child}
                            locale={locale}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TopLevelCategory({
    category,
    locale,
}: {
    category: Category;
    locale: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const name = getLocalizedValue(category, 'name_', locale);
    const hasChildren = category.children && category.children.length > 0;

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    };

    if (!hasChildren) {
        return (
            <Link
                href={routes.category(category.slug)}
                className={cn(
                    'text-text-secondary relative px-3 py-2 font-medium transition-colors',
                    'hover:text-accent',
                    'after:bg-accent after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-all',
                    'hover:after:w-full',
                )}
            >
                {name}
            </Link>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={routes.category(category.slug)}
                className={cn(
                    'text-text-secondary flex items-center gap-1 px-3 py-2 font-medium transition-colors',
                    'hover:text-accent',
                    'after:bg-accent after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-all',
                    'hover:after:w-full',
                )}
            >
                {name}
                <svg
                    className="h-3.5 w-3.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </Link>

            {isOpen && (
                <div className="border-border bg-background absolute top-full left-0 z-50 mt-1 min-w-[220px] rounded-lg border py-1 shadow-lg">
                    {category.children!.map((child) => (
                        <CategoryDropdown
                            key={child.id}
                            category={child}
                            locale={locale}
                            depth={1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SearchButton({ placeholder }: { placeholder: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(routes.search(query.trim()));
            setIsOpen(false);
            setQuery('');
        }
    };

    return (
        <div className="relative flex items-center">
            {isOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="absolute top-1/2 right-0 -translate-y-1/2"
                >
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => {
                            if (!query) setIsOpen(false);
                        }}
                        placeholder={placeholder}
                        className={cn(
                            'border-border bg-surface text-text-primary w-48 rounded-lg border px-3 py-1.5 outline-none',
                            'placeholder:text-text-muted transition-all',
                            'focus:border-accent focus:ring-accent/20 focus:ring-2',
                            'sm:w-56',
                        )}
                    />
                </form>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'text-text-secondary flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    'hover:bg-surface-hover hover:text-accent',
                    isOpen && 'text-accent',
                )}
                aria-label="Search"
            >
                <svg
                    className="h-[18px] w-[18px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </button>
        </div>
    );
}

function LocaleSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = useCallback(() => {
        const nextLocale = locale === 'vi' ? 'en' : 'vi';
        // Replace the locale segment in the URL
        const segments = pathname.split('/');
        segments[1] = nextLocale;
        router.push(segments.join('/'));
    }, [locale, pathname, router]);

    return (
        <button
            type="button"
            onClick={switchLocale}
            className={cn(
                'text-text-secondary flex h-9 items-center gap-1.5 rounded-lg px-2.5 font-medium transition-colors',
                'hover:bg-surface-hover hover:text-accent',
            )}
            aria-label={`Switch to ${locale === 'vi' ? 'English' : 'Vietnamese'}`}
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
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
            </svg>
            <span className="uppercase">{locale === 'vi' ? 'EN' : 'VI'}</span>
        </button>
    );
}

function MobileMenu({
    brand,
    categories,
    locale,
    isOpen,
    onClose,
}: {
    brand: BrandSettings;
    categories: Category[];
    locale: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    const t = useTranslations('header');

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity',
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={cn(
                    'bg-background fixed top-0 right-0 z-50 h-full w-[280px] max-w-[85vw] shadow-2xl transition-transform',
                    isOpen ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                {/* Drawer Header */}
                <div className="border-border flex items-center justify-between border-b px-4 py-4">
                    <span className="text-text-primary font-semibold">
                        {brand.title}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-text-secondary hover:bg-surface-hover flex h-8 w-8 items-center justify-center rounded-lg"
                        aria-label={t('closeMenu')}
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="overflow-y-auto p-4">
                    <MobileCategoryList
                        categories={categories}
                        locale={locale}
                    />
                </nav>
            </div>
        </>
    );
}

function MobileCategoryList({
    categories,
    locale,
    depth = 0,
}: {
    categories: Category[];
    locale: string;
    depth?: number;
}) {
    return (
        <ul
            className={cn(
                'space-y-0.5',
                depth > 0 && 'border-border-light ml-3 border-l pl-3',
            )}
        >
            {categories.map((category) => (
                <MobileCategoryItem
                    key={category.id}
                    category={category}
                    locale={locale}
                    depth={depth}
                />
            ))}
        </ul>
    );
}

function MobileCategoryItem({
    category,
    locale,
    depth,
}: {
    category: Category;
    locale: string;
    depth: number;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const name = getLocalizedValue(category, 'name_', locale);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <li>
            <div className="flex items-center">
                <Link
                    href={routes.category(category.slug)}
                    className={cn(
                        'text-text-secondary flex-1 rounded-md px-3 py-2 transition-colors',
                        'hover:bg-surface-hover hover:text-accent',
                        depth === 0 && 'font-medium',
                    )}
                >
                    {name}
                </Link>

                {hasChildren && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-text-muted hover:bg-surface-hover flex h-8 w-8 items-center justify-center rounded-md"
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
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {hasChildren && isExpanded && (
                <MobileCategoryList
                    categories={category.children!}
                    locale={locale}
                    depth={depth + 1}
                />
            )}
        </li>
    );
}

// ==================== Main Header ====================

export function Header({ brand, categories }: HeaderProps) {
    const locale = useLocale();
    const t = useTranslations('header');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <header className="border-header-border bg-header-bg sticky top-0 z-30 border-b backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-(--max-width) items-center justify-between gap-4 px-4 sm:px-6">
                    {/* Left: Logo & Name */}
                    <Link
                        href="/"
                        className="group flex shrink-0 items-center gap-2.5"
                    >
                        {brand.logo ? (
                            <Image
                                src={brand.logo}
                                alt={brand.title}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-lg object-contain transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white">
                                {brand.title.charAt(0)}
                            </div>
                        )}
                        <span className="text-text-primary hidden text-lg font-semibold sm:block">
                            {brand.title}
                        </span>
                    </Link>

                    {/* Center: Category Navigation (Desktop) */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {categories.map((category) => (
                            <TopLevelCategory
                                key={category.id}
                                category={category}
                                locale={locale}
                            />
                        ))}
                    </nav>

                    {/* Right: Search, Locale, Mobile Menu */}
                    <div className="flex items-center gap-1">
                        <SearchButton placeholder={t('searchPlaceholder')} />
                        <LocaleSwitcher />

                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className={cn(
                                'text-text-secondary flex h-9 w-9 items-center justify-center rounded-lg transition-colors lg:hidden',
                                'hover:bg-surface-hover hover:text-accent',
                            )}
                            aria-label={t('menu')}
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu — outside header to avoid stacking context issues */}
            <MobileMenu
                brand={brand}
                categories={categories}
                locale={locale}
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />
        </>
    );
}
