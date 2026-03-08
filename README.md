# VietDuc Blog Client v2

A modern, SEO-optimized blog frontend built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Features internationalization (English/Vietnamese), server-side rendering, and a clean responsive design.

## ✨ Features

- **Blog Pages** — Homepage with featured post, paginated grid, post detail with 3-column layout
- **Search** — Keyword-based search with paginated results
- **Categories & Tags** — Filtered listing pages with pagination
- **About Page** — Profile hero with gradient background, social links, and markdown content
- **Internationalization** — Full i18n support (EN/VI) via `next-intl`
- **Markdown Rendering** — GFM tables, scrollable code blocks, custom link styling
- **SEO** — Per-page metadata, Open Graph tags, canonical URLs, sitemap support
- **Google Analytics** — Optional GA4 integration
- **On-Demand Revalidation** — Cache invalidation via API with secret token
- **Sitemap** — Auto-generated sitemap with all posts, categories, tags, and static pages
- **Responsive Design** — Mobile-first with sticky header, drawer menu, and adaptive layouts
- **Custom 404** — Branded not-found page with illustration

## 🛠 Tech Stack

| Category      | Technology                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org/) (App Router)                                                                                   |
| UI            | [React 19](https://react.dev/)                                                                                                   |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com/) + [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)  |
| Language      | [TypeScript 5](https://www.typescriptlang.org/)                                                                                  |
| i18n          | [next-intl](https://next-intl.dev/)                                                                                              |
| Search Params | [nuqs](https://nuqs.47ng.com/)                                                                                                   |
| Markdown      | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)              |
| Analytics     | [@next/third-parties](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries) (Google Analytics) |
| Font          | Google Sans (via CDN)                                                                                                            |

## 📁 Project Structure

```
app/
├── [locale]/
│   ├── page.tsx              # Homepage (featured + paginated posts)
│   ├── layout.tsx            # Locale layout (header, footer, SEO)
│   ├── about/page.tsx        # About page
│   ├── posts/[slug]/page.tsx # Post detail
│   ├── categories/[slug]/    # Posts by category
│   ├── tags/[slug]/          # Posts by tag
│   └── search/page.tsx       # Search results
├── not-found.tsx             # Custom 404 page
├── sitemap.ts                # Auto-generated sitemap
├── layout.tsx                # Root layout (fonts, analytics)
└── globals.css               # Tailwind config + design tokens

components/
├── home/                     # FeaturedPost, PostCard, Pagination
├── layout/                   # Header, Footer
├── post/                     # ShareSidebar
├── empty-state.tsx           # Reusable empty/no-data state
└── markdown-renderer.tsx     # Markdown with prose styling

libs/
├── api/public.ts             # API client (getPosts, getPostBySlug, etc.)
├── types/api.ts              # TypeScript interfaces
├── routes.ts                 # Centralized route definitions
├── constants.ts              # Site-wide constants from env vars
└── utils.ts                  # cn(), getLocalizedValue()
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **Yarn** or npm
- Backend API server running (see [vietduc-blog-server](https://github.com/duc30012001/vietduc-blog-server))

### Installation

```bash
# Clone the repository
git clone https://github.com/duc30012001/vietduc-blog-client-v2.git
cd vietduc-blog-client-v2

# Install dependencies
yarn install

# Copy environment file
cp .env.example .env
```

### Environment Variables

| Variable                    | Description                     | Default                    |
| --------------------------- | ------------------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL`       | Backend API base URL            | `http://localhost:8080/v1` |
| `NEXT_PUBLIC_SITE_URL`      | Public-facing site URL          | `http://localhost:3000`    |
| `NEXT_PUBLIC_SITE_NAME`     | Site name for meta tags         | `Duck Blog`                |
| `NEXT_PUBLIC_SITE_KEYWORDS` | SEO keywords (comma-separated)  | `blog, technology...`      |
| `NEXT_PUBLIC_GA_ID`         | Google Analytics ID (optional)  | —                          |
| `REVALIDATION_SECRET`       | Cache revalidation secret token | —                          |

### Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
yarn build
yarn start
```

## 📄 API Routes

| Method | Route             | Description                                                   |
| ------ | ----------------- | ------------------------------------------------------------- |
| `POST` | `/api/revalidate` | On-demand cache revalidation (requires `REVALIDATION_SECRET`) |

## 🌐 Supported Locales

- **English** (`/en/...`)
- **Vietnamese** (`/vi/...`)

Translation files are located in `messages/en.json` and `messages/vi.json`.

## 📝 License

Private project.
