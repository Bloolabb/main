import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const now = new Date()

  // Define routes with specific priorities and change frequencies
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/learn", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/leaderboard", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/school", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/achievements", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/ai-tutor", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/auth/login", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/auth/sign-up", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/dashboard", priority: 0.9, changeFrequency: "daily" as const },
  ]

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}