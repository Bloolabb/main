import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import "./globals.css"

// Configure Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
    template: "%s | bloolabb",
  },
  description:
    "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises. Join 50,000+ learners today.",
  
  keywords: [
    "AI learning",
    "artificial intelligence education",
    "entrepreneurship education",
    "gamified learning platform",
    "teen education",
    "online courses",
    "machine learning for beginners",
    "business skills",
    "coding for teens",
    "STEM education",
    "interactive learning",
    "educational technology",
    "youth entrepreneurship",
    "AI courses",
    "learn programming"
  ],
  authors: [{ name: "bloolabb Team", url: "https://bloolabb.com" }],
  creator: "bloolabb",
  publisher: "bloolabb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/assets/black-logo.png" },
      { url: "/assets/black-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/white-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/assets/black-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloolabb.com",
    title: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
    description:
      "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises. Join 50,000+ learners today.",
    siteName: "bloolabb",
    images: [
      {
        url: "/assets/black-logo.png",
        width: 1200,
        height: 630,
        alt: "bloolabb - Learn AI & Entrepreneurship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bloolabb",
    creator: "@bloolabb",
    title: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
    description:
      "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises. Join 50,000+ learners today.",
    images: ["/assets/white-logo.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "bloolabb",
  },
  applicationName: "bloolabb",
  referrer: "origin-when-cross-origin",
  appLinks: {
    web: {
      url: "https://bloolabb.com",
      should_fallback: true,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'bloolabb',
    description: 'Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises.',
    url: 'https://bloolabb.com',
    logo: 'https://bloolabb.com/assets/black-logo.png',
    sameAs: [
      'https://twitter.com/bloolabb',
      'https://www.facebook.com/bloolabb',
      'https://www.linkedin.com/company/bloolabb',
      'https://www.instagram.com/bloolabb'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@bloolabb.com'
    },
    offers: {
      '@type': 'Offer',
      category: 'Education',
      priceCurrency: 'USD',
      price: '0',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '50000',
      bestRating: '5',
      worstRating: '1'
    }
  }

  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="font-sans antialiased"
        style={
          {
            "--font-nunito": nunito.style.fontFamily,
          } as React.CSSProperties
        }
      >
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {children}
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}