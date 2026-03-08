/**
 * Site-wide constants derived from environment variables.
 * All values have sensible defaults for local development.
 */

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'VietDuc Blog';

export const SITE_KEYWORDS =
    process.env.NEXT_PUBLIC_SITE_KEYWORDS ||
    'blog, technology, programming, web development';

export const FALLBACK_OG_IMAGE = '/background.png';

export const FALLBACK_LOGO = '/logo.png';
