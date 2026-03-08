import { getTranslations, setRequestLocale } from 'next-intl/server';

import { FeaturedPost } from '@/components/home/featured-post';
import { Pagination } from '@/components/home/pagination';
import { PostCard } from '@/components/home/post-card';
import { getFeaturedPost, getPosts } from '@/libs/api/public';

// ==================== Types ====================

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string }>;
};

// ==================== Constants ====================

const POSTS_PER_PAGE = 12;

// ==================== Page ====================

export default async function HomePage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { page } = await searchParams;

    setRequestLocale(locale);

    const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1);

    const [t, featuredPost, postsResponse] = await Promise.all([
        getTranslations('home'),
        getFeaturedPost(),
        getPosts({ page: currentPage, limit: POSTS_PER_PAGE }),
    ]);

    return (
        <>
            {/* Featured Post Hero */}
            {featuredPost && (
                <FeaturedPost
                    post={featuredPost}
                    locale={locale}
                    label={t('featuredPost')}
                    readMoreLabel={t('readMore')}
                />
            )}

            {/* Recent Stories Section */}
            <section>
                <h2 className="text-text-primary mb-8 flex items-center text-2xl font-bold">
                    <span className="bg-accent mr-3 h-1 w-8 rounded-full" />
                    {t('recentStories')}
                </h2>

                {postsResponse.data.length > 0 ? (
                    <>
                        {/* Posts Grid */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {postsResponse.data.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    locale={locale}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            meta={postsResponse.meta}
                            basePath={`/${locale}`}
                        />
                    </>
                ) : (
                    <p className="text-text-muted py-12 text-center">
                        {t('noPosts')}
                    </p>
                )}
            </section>
        </>
    );
}
