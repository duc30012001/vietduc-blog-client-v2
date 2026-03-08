/**
 * Centralized route generation for the blog.
 * All application routes should be defined here.
 */

export const routes = {
    home: () => '/',
    search: (query: string) => `/search?q=${encodeURIComponent(query)}`,

    // Categories
    category: (slug: string) => `/categories/${slug}`,
    categoryPosts: (slug: string) => `/categories/${slug}/posts`,

    // Posts
    posts: () => '/posts',
    post: (slug: string) => `/posts/${slug}`,

    // Tags
    tag: (slug: string) => `/tags/${slug}`,
    tagPosts: (slug: string) => `/tags/${slug}/posts`,

    // Pages
    about: () => '/about',
} as const;
