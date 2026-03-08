import type { Category, SiteSettings } from '@/libs/types/api';

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
