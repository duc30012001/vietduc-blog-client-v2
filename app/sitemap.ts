import type { MetadataRoute } from 'next';

import { getSitemapData } from '@/libs/api/public';
import { SITE_URL } from '@/libs/constants';

const locales = ['en', 'vi'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapData = await getSitemapData();

    const entries: MetadataRoute.Sitemap = [];

    // Static pages
    for (const locale of locales) {
        entries.push(
            {
                url: `${SITE_URL}/${locale}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${SITE_URL}/${locale}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
        );
    }

    // Posts
    for (const post of sitemapData.posts) {
        for (const locale of locales) {
            entries.push({
                url: `${SITE_URL}/${locale}/posts/${post.slug}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }
    }

    // Categories
    for (const category of sitemapData.categories) {
        for (const locale of locales) {
            entries.push({
                url: `${SITE_URL}/${locale}/categories/${category.slug}`,
                lastModified: new Date(category.updated_at),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        }
    }

    // Tags
    for (const tag of sitemapData.tags) {
        for (const locale of locales) {
            entries.push({
                url: `${SITE_URL}/${locale}/tags/${tag.slug}`,
                lastModified: new Date(tag.updated_at),
                changeFrequency: 'weekly',
                priority: 0.4,
            });
        }
    }

    return entries;
}
