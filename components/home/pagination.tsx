'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { cn } from '@/libs/utils';

import type { PaginationMeta } from '@/libs/types/api';

// ==================== Types ====================

interface PaginationProps {
    meta: PaginationMeta;
    basePath?: string;
}

// ==================== Helpers ====================

function getPageNumbers(
    currentPage: number,
    totalPages: number,
): (number | 'ellipsis')[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [1];

    if (currentPage > 3) {
        pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
}

function buildPageUrl(page: number, basePath: string): string {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
}

// ==================== Component ====================

export function Pagination({ meta, basePath = '' }: PaginationProps) {
    const t = useTranslations('home');
    const { page: currentPage, totalPages } = meta;

    if (totalPages <= 1) return null;

    const pages = getPageNumbers(currentPage, totalPages);

    const buttonBase = cn(
        'flex h-10 min-w-10 items-center justify-center rounded-lg px-3',
        'text-sm font-medium transition-colors',
    );

    return (
        <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Pagination"
        >
            {/* Previous Button */}
            {meta.hasPreviousPage ? (
                <Link
                    href={buildPageUrl(currentPage - 1, basePath)}
                    className={cn(
                        buttonBase,
                        'text-text-secondary hover:bg-surface-hover hover:text-accent',
                    )}
                    aria-label={t('previous')}
                >
                    <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    {t('previous')}
                </Link>
            ) : (
                <span
                    className={cn(
                        buttonBase,
                        'pointer-events-none cursor-not-allowed opacity-40',
                        'text-text-muted',
                    )}
                    aria-disabled="true"
                >
                    <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    {t('previous')}
                </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((pageItem, index) => {
                    if (pageItem === 'ellipsis') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="text-text-muted flex h-10 w-10 items-center justify-center text-sm"
                            >
                                ···
                            </span>
                        );
                    }

                    const isActive = pageItem === currentPage;

                    return (
                        <Link
                            key={pageItem}
                            href={buildPageUrl(pageItem, basePath)}
                            className={cn(
                                buttonBase,
                                isActive
                                    ? 'bg-accent pointer-events-none text-white'
                                    : 'text-text-secondary hover:bg-surface-hover hover:text-accent',
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {pageItem}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            {meta.hasNextPage ? (
                <Link
                    href={buildPageUrl(currentPage + 1, basePath)}
                    className={cn(
                        buttonBase,
                        'text-text-secondary hover:bg-surface-hover hover:text-accent',
                    )}
                    aria-label={t('next')}
                >
                    {t('next')}
                    <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            ) : (
                <span
                    className={cn(
                        buttonBase,
                        'pointer-events-none cursor-not-allowed opacity-40',
                        'text-text-muted',
                    )}
                    aria-disabled="true"
                >
                    {t('next')}
                    <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </span>
            )}
        </nav>
    );
}
