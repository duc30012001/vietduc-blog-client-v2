import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/home/pagination';
import { PostCard } from '@/components/home/post-card';
import { getCategories, getPosts } from '@/libs/api/public';
import { SITE_NAME, SITE_URL } from '@/libs/constants';
import { getLocalizedValue } from '@/libs/utils';

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
    const categories = await getCategories();
    const category = categories
        .flatMap((c) => [c, ...(c.children ?? [])])
        .find((c) => c.slug === slug);

    if (!category) return { title: 'Not Found' };

    const name = getLocalizedValue(category, 'name_', locale);

    return {
        title: name,
        description: category.description || undefined,
        alternates: {
            canonical: `${SITE_URL}/${locale}/categories/${slug}`,
        },
        openGraph: {
            title: name,
            siteName: SITE_NAME,
            url: `${SITE_URL}/${locale}/categories/${slug}`,
        },
    };
}

// ==================== Page ====================

export default async function CategoryPage({ params, searchParams }: Props) {
    const { locale, slug } = await params;
    const { page: pageParam } = await searchParams;

    setRequestLocale(locale);

    const page = Math.max(1, Number(pageParam) || 1);

    const [t, categories, postsResponse] = await Promise.all([
        getTranslations('category'),
        getCategories(),
        getPosts({ page, limit: POSTS_PER_PAGE, category_slug: slug }),
    ]);

    const category = categories
        .flatMap((c) => [c, ...(c.children ?? [])])
        .find((c) => c.slug === slug);

    if (!category) notFound();

    const name = getLocalizedValue(category, 'name_', locale);
    const { data: posts, meta } = postsResponse;

    return (
        <div>
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-text-primary text-3xl font-bold">
                    {t('title', { name })}
                </h1>
                {category.description && (
                    <p className="text-text-secondary mt-3 text-lg">
                        {category.description}
                    </p>
                )}
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
                            basePath={`/${locale}/categories/${slug}`}
                        />
                    )}
                </>
            ) : (
                <EmptyState title={t('noPosts')} />
            )}
        </div>
    );
}
