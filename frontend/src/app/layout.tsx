import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Source_Sans_3,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Providers } from "@/lib/providers/providers";

const sourceSans3Heading = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-heading",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://documind-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DocuMind — Grounded AI Document Intelligence & RAG Chat",
    template: "%s | DocuMind",
  },
  description:
    "Chat with enterprise documents, financial statements, and PDFs in real-time. Instant streaming answers backed by Pinecone vector retrieval and verifiable citations.",
  keywords: [
    "DocuMind",
    "AI Document Chat",
    "Chat with PDF",
    "RAG",
    "Retrieval Augmented Generation",
    "Pinecone Vector Search",
    "Inngest Document Processing",
    "Financial Document AI",
    "Legal Contract AI",
    "Semantic Search",
  ],
  authors: [{ name: "DocuMind Team" }],
  creator: "DocuMind",
  publisher: "DocuMind AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "DocuMind",
    title: "DocuMind — Grounded AI Document Intelligence & RAG Chat",
    description:
      "Chat with enterprise documents, financial statements, and PDFs in real-time with verified citations and sub-second streaming answers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuMind — Grounded AI Document Intelligence & RAG Chat",
    description:
      "Chat with enterprise documents, financial statements, and PDFs in real-time with verified citations and sub-second streaming answers.",
    creator: "@documind",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "productivity",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        ibmPlexSans.variable,
        sourceSans3Heading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
