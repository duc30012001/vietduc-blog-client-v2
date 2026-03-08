// ==================== Site Settings ====================

export interface SocialLink {
    logo: string;
    name: string;
    url: string;
    enabled: boolean;
}

export interface BrandSettings {
    logo: string;
    title: string;
    shortIntroVi: string;
    shortIntroEn: string;
    fullIntroVi: string;
    fullIntroEn: string;
    contactEmail: string;
}

export interface SiteSettings {
    brand: BrandSettings;
    socials: SocialLink[];
}

// ==================== Categories ====================

export interface Category {
    id: string;
    slug: string;
    name_vi: string;
    name_en: string;
    description?: string;
    order: number;
    parent_id?: string;
    children?: Category[];
    post_count: number;
}

// ==================== Posts ====================

export interface PostCategory {
    id: string;
    slug: string;
    name_vi: string;
    name_en: string;
}

export interface PostTag {
    id: string;
    slug: string;
    name_vi: string;
    name_en: string;
}

export interface Post {
    id: string;
    slug: string;
    title_vi: string;
    title_en: string;
    excerpt_vi: string | null;
    excerpt_en: string | null;
    content_vi: string;
    content_en: string;
    thumbnail: string | null;
    view_count: number;
    published_at: string | null;
    category: PostCategory | null;
    tags: PostTag[];
    created_at: string;
}

// ==================== Pagination ====================

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

// ==================== Sitemap ====================

export interface SitemapItem {
    slug: string;
    updated_at: string;
}

export interface SitemapData {
    posts: SitemapItem[];
    categories: SitemapItem[];
    tags: SitemapItem[];
}
