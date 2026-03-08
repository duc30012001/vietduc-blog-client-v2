import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/libs/routes';
import { cn, getLocalizedValue } from '@/libs/utils';

import type { Post } from '@/libs/types/api';

// ==================== Types ====================

interface PostCardProps {
    post: Post;
    locale: string;
}

// ==================== Component ====================

export function PostCard({ post, locale }: PostCardProps) {
    const title = getLocalizedValue(post, 'title_', locale);
    const excerpt = getLocalizedValue(post, 'excerpt_', locale) || null;
    const categoryName = post.category
        ? getLocalizedValue(post.category, 'name_', locale)
        : null;

    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString(
              locale === 'vi' ? 'vi-VN' : 'en-US',
              { year: 'numeric', month: 'short', day: 'numeric' },
          )
        : null;

    return (
        <article className="group flex cursor-pointer flex-col">
            <Link
                href={routes.post(post.slug)}
                className="block"
                aria-label={title}
            >
                {/* Thumbnail */}
                <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                    {post.thumbnail ? (
                        <Image
                            src={post.thumbnail}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                        />
                    ) : (
                        <div className="bg-surface flex h-full w-full items-center justify-center">
                            <svg
                                className="text-text-muted h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Meta: Category + Date */}
                <div className="mb-3 flex items-center gap-3">
                    {categoryName && (
                        <span className="text-accent text-xs font-bold tracking-wide uppercase">
                            {categoryName}
                        </span>
                    )}
                    {publishedDate && (
                        <span className="text-text-muted text-xs">
                            {publishedDate}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3
                    className={cn(
                        'text-text-primary mb-3 text-lg leading-snug font-bold',
                        'group-hover:text-accent transition-colors',
                    )}
                >
                    {title}
                </h3>

                {/* Excerpt */}
                {excerpt && (
                    <p className="text-text-secondary line-clamp-2 text-sm leading-relaxed">
                        {excerpt}
                    </p>
                )}
            </Link>
        </article>
    );
}
