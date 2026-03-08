import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/libs/routes';
import { cn, getLocalizedValue } from '@/libs/utils';

import type { Post } from '@/libs/types/api';

// ==================== Types ====================

interface FeaturedPostProps {
    post: Post;
    locale: string;
    label: string;
    readMoreLabel: string;
}

// ==================== Component ====================

export function FeaturedPost({
    post,
    locale,
    label,
    readMoreLabel,
}: FeaturedPostProps) {
    const title = getLocalizedValue(post, 'title_', locale);
    const excerpt = getLocalizedValue(post, 'excerpt_', locale) || null;

    return (
        <section className="mb-12">
            <Link
                href={routes.post(post.slug)}
                className="group relative block aspect-21/9 overflow-hidden rounded-2xl bg-gray-900"
            >
                {/* Background Image */}
                {post.thumbnail && (
                    <Image
                        src={post.thumbnail}
                        alt={title}
                        fill
                        className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        priority
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 max-w-3xl p-6 sm:p-10 md:p-14">
                    <span
                        className={cn(
                            'bg-accent mb-4 inline-block rounded px-3 py-1',
                            'text-xs font-semibold tracking-wider text-white uppercase',
                        )}
                    >
                        {label}
                    </span>

                    <h1 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        {title}
                    </h1>

                    {excerpt && (
                        <p className="mb-6 line-clamp-2 text-base text-gray-200 sm:text-lg">
                            {excerpt}
                        </p>
                    )}

                    <span
                        className={cn(
                            'inline-flex items-center rounded-md px-5 py-2.5',
                            'bg-white text-sm font-medium text-gray-900',
                            'transition-colors group-hover:bg-gray-100',
                        )}
                    >
                        {readMoreLabel}
                        <svg
                            className="ml-2 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </div>
            </Link>
        </section>
    );
}
