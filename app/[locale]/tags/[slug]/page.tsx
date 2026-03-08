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
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ page?: string }>;
};

// ==================== Metadata ====================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: 'tag' });

    // Use slug as display name (decoded)
    const name = decodeURIComponent(slug);

    return {
        title: t('title', { name }),
        alternates: {
            canonical: `${SITE_URL}/${locale}/tags/${slug}`,
        },
        openGraph: {
            title: t('title', { name }),
            siteName: SITE_NAME,
            url: `${SITE_URL}/${locale}/tags/${slug}`,
        },
    };
}

// ==================== Page ====================

export default async function TagPage({ params, searchParams }: Props) {
    const { locale, slug } = await params;
    const { page: pageParam } = await searchParams;

    setRequestLocale(locale);

    const page = Math.max(1, Number(pageParam) || 1);

    const [t, postsResponse] = await Promise.all([
        getTranslations('tag'),
        getPosts({ page, limit: POSTS_PER_PAGE, tag_slug: slug }),
    ]);

    const name = decodeURIComponent(slug);
    const { data: posts, meta } = postsResponse;

    return (
        <div>
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-text-primary text-3xl font-bold">
                    {t('title', { name })}
                </h1>
            </header>

            {/* Posts Grid */}
            {posts.length > 0 ? (
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

                    {meta.totalPages > 1 && (
                        <Pagination
                            meta={meta}
                            basePath={`/${locale}/tags/${slug}`}
                        />
                    )}
                </>
            ) : (
                <EmptyState title={t('noPosts')} />
            )}
        </div>
    );
}
