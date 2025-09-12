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
  title: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
  description:
    "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises. Join 50,000+ learners today.",
  
  keywords:
    "AI learning, entrepreneurship education, gamified learning, teen education, artificial intelligence courses",
  authors: [{ name: "bloolabb Team" }],
  creator: "bloolabb",
  publisher: "bloolabb",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloolabb.com",
    title: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
    description:
      "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises.",
    siteName: "bloolabb",
  },
  twitter: {
    card: "summary_large_image",
    title: "bloolabb - Learn AI & Entrepreneurship the Fun Way",
    description:
      "Interactive learning platform for teens to master AI fundamentals and entrepreneurship skills through gamified lessons and exercises.",
    creator: "@bloolabb",
  },
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