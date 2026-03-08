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
