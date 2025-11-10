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
  metadataBase: new URL("https://www.bloolabb.com"),
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
  ],
  authors: [{ name: "bloolabb" }],
  creator: "bloolabb",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.bloolabb.com",
  },
  icons: {
    icon: "/assets/black-logo.png",
    apple: "/assets/black-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.bloolabb.com",
    title: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
    description:
      "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises.",
    siteName: "bloolabb",
    images: [
      {
        url: "https://www.bloolabb.com/assets/black-logo.png",
        width: 1200,
        height: 630,
        alt: "bloolabb",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
    description:
      "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills.",
    images: ["https://www.bloolabb.com/assets/black-logo.png"],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={nunito.variable}>
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