import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import AuthProvider from "@/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "MasjidQuran - Online Collaborative Quran Reading",
    template: "%s | MasjidQuran",
  },
  description: "A collaborative platform for reading and completing the Quran together.",
  keywords: ["quran", "islam", "reading", "collaboration", "khatm", "juz", "para", "surah"],
  authors: [
    {
      name: "MasjidQuran",
    },
  ],
  creator: "MasjidQuran",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MasjidQuran - Online Collaborative Quran Reading",
    description: "A collaborative platform for reading and completing the Quran together.",
    siteName: "MasjidQuran",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MasjidQuran",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MasjidQuran - Online Collaborative Quran Reading",
    description: "A collaborative platform for reading and completing the Quran together.",
    images: ["/og-image.png"],
    creator: "@masjidquran",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'