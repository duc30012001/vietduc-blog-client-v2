import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostCard } from '@/components/home/post-card';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { ShareSidebar } from '@/components/post/share-button';

import { getPostBySlug, getRelatedPosts } from '@/libs/api/public';
import { FALLBACK_OG_IMAGE, SITE_NAME, SITE_URL } from '@/libs/constants';
import { routes } from '@/libs/routes';
import { cn, getLocalizedValue } from '@/libs/utils';

// ==================== Types ====================

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

// ==================== Metadata ====================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) return { title: 'Not Found' };

    const title = getLocalizedValue(post, 'title_', locale);
    const excerpt = getLocalizedValue(post, 'excerpt_', locale);
    const ogImage = post.thumbnail || `${SITE_URL}${FALLBACK_OG_IMAGE}`;
    const url = `${SITE_URL}/${locale}/posts/${slug}`;

    return {
        title,
        description: excerpt || undefined,

        openGraph: {
            type: 'article',
            title,
            description: excerpt || undefined,
            url,
            siteName: SITE_NAME,
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            publishedTime: post.published_at ?? undefined,
            tags: post.tags.map((tag) =>
                getLocalizedValue(tag, 'name_', locale),
            ),
        },

        twitter: {
            card: 'summary_large_image',
            title,
            description: excerpt || undefined,
            images: [ogImage],
        },

        alternates: {
            canonical: url,
        },
    };
}

// ==================== Helper Components ====================

function PostMeta({
    categoryName,
    categorySlug,
    date,
    viewLabel,
}: {
    categoryName: string | null;
    categorySlug: string | null;
    date: string | null;
    viewLabel: string;
}) {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            {categoryName && categorySlug && (
                <Link
                    href={routes.category(categorySlug)}
                    className="bg-accent/10 text-accent hover:bg-accent/20 rounded-full px-3 py-1 font-semibold transition-colors"
                >
                    {categoryName}
                </Link>
            )}
            {date && (
                <span className="text-text-muted flex items-center gap-1.5">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                    </svg>
                    {date}
                </span>
            )}
            <span className="text-text-muted flex items-center gap-1.5">
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                {viewLabel}
            </span>
        </div>
    );
}

function TagList({
    tags,
    locale,
    label,
}: {
    tags: { slug: string; name_vi: string; name_en: string }[];
    locale: string;
    label: string;
}) {
    if (tags.length === 0) return null;

    return (
        <div>
            <h3 className="text-text-secondary mb-3 text-sm font-semibold">
                {label}
            </h3>
            <div className="flex flex-wrap gap-2 lg:flex-col">
                {tags.map((tag) => (
                    <Link
                        key={tag.slug}
                        href={routes.tag(tag.slug)}
                        className={cn(
                            'bg-surface border-border rounded-full border px-3 py-1.5 text-xs font-medium',
                            'text-text-secondary hover:border-accent hover:text-accent transition-colors',
                        )}
                    >
                        # {getLocalizedValue(tag, 'name_', locale)}
                    </Link>
                ))}
            </div>
        </div>
    );
}

// ==================== Page ====================

export default async function PostDetailPage({ params }: Props) {
    const { locale, slug } = await params;

    setRequestLocale(locale);

    const [t, post, relatedPosts] = await Promise.all([
        getTranslations('post'),
        getPostBySlug(slug),
        getRelatedPosts(slug),
    ]);

    if (!post) notFound();

    const title = getLocalizedValue(post, 'title_', locale);
    const content = getLocalizedValue(post, 'content_', locale);
    const categoryName = post.category
        ? getLocalizedValue(post.category, 'name_', locale)
        : null;

    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString(
              locale === 'vi' ? 'vi-VN' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' },
          )
        : null;

    const postUrl = `${SITE_URL}/${locale}/posts/${slug}`;
    const viewLabel = t('views', { count: post.view_count.toLocaleString() });

    return (
        <article>
            {/* Hero Thumbnail */}
            {post.thumbnail && (
                <div className="relative mb-8 aspect-21/9 overflow-hidden rounded-2xl">
                    <Image
                        src={post.thumbnail}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        priority
                    />
                </div>
            )}

            {/* Post Header */}
            <header className="mb-8">
                <PostMeta
                    categoryName={categoryName}
                    categorySlug={post.category?.slug ?? null}
                    date={publishedDate}
                    viewLabel={viewLabel}
                />

                <h1 className="text-text-primary mb-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                    {title}
                </h1>
            </header>

            {/* 3-Column Layout: Share | Content | Tags */}
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[60px_1fr_200px]">
                {/* Left: Share Sidebar (sticky on desktop, inline on mobile) */}
                <aside className="order-3 lg:order-1">
                    <div className="flex gap-3 lg:sticky lg:top-24 lg:flex-col lg:items-center lg:gap-3">
                        <ShareSidebar url={postUrl} title={title} />
                    </div>
                </aside>

                {/* Center: Post Content */}
                <div className="order-1 min-w-0 lg:order-2">
                    <MarkdownRenderer
                        content={content}
                        className="prose max-w-none"
                    />
                </div>

                {/* Right: Tags Sidebar (sticky on desktop) */}
                <aside className="order-2 lg:order-3">
                    <div className="lg:sticky lg:top-24">
                        <TagList
                            tags={post.tags}
                            locale={locale}
                            label={t('tags')}
                        />
                    </div>
                </aside>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-text-primary mb-8 flex items-center text-2xl font-bold">
                        <span className="bg-accent mr-3 h-1 w-8 rounded-full" />
                        {t('relatedPosts')}
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {relatedPosts.slice(0, 3).map((relatedPost) => (
                            <PostCard
                                key={relatedPost.id}
                                post={relatedPost}
                                locale={locale}
                            />
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
}
