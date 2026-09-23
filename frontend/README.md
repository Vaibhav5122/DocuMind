# DocuMind Frontend Application

Modern, high-performance user interface for **DocuMind** built with **Next.js 16.3 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🎨 UI Architecture & Feature Highlights

- **Real-Time Streaming Chat View**: Consumes Server-Sent Events (`text/event-stream`) with `ReadableStream` reader, auto-scrolling, and Markdown code syntax rendering.
- **Dynamic AI Conversation Titling**: Automatically summarizes first user queries into concise 3-5 word titles.
- **Enterprise Document Dashboard**:
  - Filterable document catalog (Processing, Ready, Failed).
  - Document upload modal with drag-and-drop validation.
  - In-browser document preview modal.
- **Edge Route Protection**: Next.js Edge Middleware (`src/middleware.ts`) intercepts route access, redirecting unauthenticated traffic to `/login?callbackUrl=...` and authenticated sessions away from auth pages.
- **Dark/Light Theme**: Powered by `next-themes` and Tailwind CSS v4 design tokens.
- **Custom Branding**: Dedicated vector logo (`DocuMindLogo`), Next.js App Router native favicon (`app/icon.svg`), and custom 404 page (`app/not-found.tsx`).

---

## 🔍 SEO & Search Engine Optimization

DocuMind is fully optimized for Google search and social discovery:

- **Dynamic Metadata**: Complete OpenGraph, Twitter card, canonical tags, and granular Googlebot directives configured in `app/layout.tsx`.
- **Dynamic OpenGraph Card**: Edge `ImageResponse` generator (`app/opengraph-image.tsx`) automatically creates 1200x630 branded social cards.
- **Robots.txt (`app/robots.ts`)**: Crawls landing page and auth pages while protecting private dashboard and chat paths from public indexes.
- **XML Sitemap (`app/sitemap.ts`)**: Generates fresh sitemap with change frequencies and priorities.

---

## 📁 Directory Structure

```
frontend/src/
├── app/
│   ├── (auth)/               # Auth routes (login, signup) with layouts & metadata
│   ├── (dashboard)/          # Authenticated routes (dashboard, chat) with navbar layout
│   ├── favicon.ico           # Legacy favicon fallback
│   ├── globals.css           # Tailwind CSS v4 theme variables
│   ├── icon.svg              # Next.js App Router native vector favicon
│   ├── layout.tsx            # Root layout with comprehensive SEO metadata & fonts
│   ├── not-found.tsx         # High-tech 404 error page with Home & Back navigation
│   ├── opengraph-image.tsx   # Dynamic 1200x630 social preview image generator
│   ├── page.tsx              # High-conversion landing page
│   ├── robots.ts             # Dynamic robots.txt generator
│   └── sitemap.ts            # Dynamic sitemap.xml generator
├── components/
│   ├── auth/                 # Avatar dropdowns, auth forms
│   ├── chat/                 # Streaming chat view, history sidebar, markdown renderer
│   ├── dashboard/            # Document tables, status badges, upload dialogs, stats
│   ├── home/                 # Bento grid feature sections
│   └── ui/                   # Button, Card, Dialog, Table, and DocuMindLogo
├── lib/
│   ├── api/                  # Axios client (withCredentials)
│   ├── auth-client.ts        # BetterAuth React client
│   ├── hooks/                # Custom React Query hooks (useDocuments, useChatStream)
│   ├── providers/            # QueryClientProvider & ThemeProvider
│   └── utils.ts
└── middleware.ts             # Next.js Edge route guard middleware
```

---

## 🚀 Local Development

```bash
# Install dependencies
pnpm install

# Setup local environment
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Vercel Production Deployment

1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your `DocuMind` repository.
4. Set the **Root Directory** to `frontend`.
5. Verify the **Framework Preset** is set to `Next.js`.
6. Add the production environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed Render backend (e.g. `https://documind-api.onrender.com`)
   - `NEXT_PUBLIC_APP_URL`: Your Vercel frontend URL (e.g. `https://documind-ai.vercel.app`)
7. Click **Deploy**.
