import type {
    Category,
    PaginatedResponse,
    Post,
    SiteSettings,
} from '@/libs/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}

async function fetchApi<T>(path: string, tags?: string[]): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        next: { tags: tags ?? [], revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText} — ${path}`);
    }

    const json: ApiResponse<T> = await res.json();
    return json.data;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
    brand: {
        logo: '',
        title: 'VietDuc Blog',
        shortIntroVi: '',
        shortIntroEn: '',
        fullIntroVi: '',
        fullIntroEn: '',
        contactEmail: '',
    },
    socials: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        return await fetchApi<SiteSettings>('/public/site-settings', [
            'site-settings',
        ]);
    } catch (error) {
        console.error('[API] Failed to fetch site settings:', error);
        return DEFAULT_SITE_SETTINGS;
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        return await fetchApi<Category[]>('/public/categories', ['categories']);
    } catch (error) {
        console.error('[API] Failed to fetch categories:', error);
        return [];
    }
}

export async function getPosts(
    params: {
        page?: number;
        limit?: number;
        category_slug?: string;
        tag_slug?: string;
        keyword?: string;
    } = {},
): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 9, category_slug, tag_slug, keyword } = params;
    const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (category_slug) query.set('category_slug', category_slug);
    if (tag_slug) query.set('tag_slug', tag_slug);
    if (keyword) query.set('keyword', keyword);

    try {
        return await fetchApi<PaginatedResponse<Post>>(
            `/public/posts?${query.toString()}`,
            ['posts'],
        );
    } catch (error) {
        console.error('[API] Failed to fetch posts:', error);
        return {
            data: [],
            meta: {
                total: 0,
                page,
                limit,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        };
    }
}

export async function getFeaturedPost(): Promise<Post | null> {
    try {
        const response = await fetchApi<PaginatedResponse<Post>>(
            '/public/posts?page=1&limit=1',
            ['posts'],
        );
        return response.data[0] ?? null;
    } catch (error) {
        console.error('[API] Failed to fetch featured post:', error);
        return null;
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        return await fetchApi<Post>(`/public/posts/${slug}`, [
            'posts',
            `post-${slug}`,
        ]);
    } catch (error) {
        console.error('[API] Failed to fetch post:', error);
        return null;
    }
}

export async function getRelatedPosts(slug: string): Promise<Post[]> {
    try {
        return await fetchApi<Post[]>(`/public/posts/${slug}/related`, [
            'posts',
        ]);
    } catch (error) {
        console.error('[API] Failed to fetch related posts:', error);
        return [];
    }
}
