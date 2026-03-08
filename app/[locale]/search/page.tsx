import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/home/pagination';
import { PostCard } from '@/components/home/post-card';
import { getPosts } from '@/libs/api/public';
import { SITE_NAME, SITE_URL } from '@/libs/constants';

// ==================== Constants ====================

const POSTS_PER_PAGE = 12;

// ==================== Types ====================

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ q?: string; page?: string }>;
};

// ==================== Metadata ====================

export async function generateMetadata({
    params,
    searchParams,
}: Props): Promise<Metadata> {
    const { locale } = await params;
    const { q } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'search' });

    const title = q ? t('titleWithQuery', { query: q }) : t('title');

    return {
        title,
        robots: { index: false },
        alternates: {
            canonical: `${SITE_URL}/${locale}/search`,
        },
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            siteName: SITE_NAME,
        },
    };
}

// ==================== Page ====================

export default async function SearchPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { q, page: pageParam } = await searchParams;

    setRequestLocale(locale);

    const page = Math.max(1, Number(pageParam) || 1);
    const t = await getTranslations('search');

    // Only fetch posts if there's a query
    const postsResponse = q
        ? await getPosts({ page, limit: POSTS_PER_PAGE, keyword: q })
        : null;

    const posts = postsResponse?.data ?? [];
    const meta = postsResponse?.meta;

    return (
        <div>
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-text-primary mb-2 text-3xl font-bold">
                    {q ? t('titleWithQuery', { query: q }) : t('title')}
                </h1>
                {q && meta && (
                    <p className="text-text-muted text-sm">
                        {t('resultCount', {
                            count: meta.total.toLocaleString(),
                        })}
                    </p>
                )}
            </header>

            {/* Results */}
            {!q ? (
                <EmptyState title={t('noQuery')} />
            ) : posts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                locale={locale}
                            />
                        ))}
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <Pagination
                            meta={meta}
                            basePath={`/${locale}/search?q=${encodeURIComponent(q)}`}
                        />
                    )}
                </>
            ) : (
                <EmptyState title={t('noResults', { query: q })} />
            )}
        </div>
    );
}
