import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const protectedPaths = ["/dashboard", "/learn", "/achievements", "/leaderboard", "/settings"]
  const authPaths = ["/auth/login", "/auth/sign-up", "/auth/check-email", "/auth/error", "/auth/onboarding"]
  const adminPaths = ["/admin"]
  const publicPaths = ["/", "/docs", "/support", "/contact", "/about"]

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  const isAdminPath = adminPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  const isPublicPath =
    publicPaths.some((path) => request.nextUrl.pathname === path) || request.nextUrl.pathname.startsWith("/docs/")

  if (isAdminPath) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If no user, redirect to admin login
    if (
      !user &&
      !request.nextUrl.pathname.startsWith("/admin/login") &&
      !request.nextUrl.pathname.startsWith("/admin/unauthorized")
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }

    // If user exists, check admin role
    if (
      user &&
      !request.nextUrl.pathname.startsWith("/admin/login") &&
      !request.nextUrl.pathname.startsWith("/admin/unauthorized")
    ) {
      const { data: adminRole } = await supabase.from("admin_roles").select("role").eq("user_id", user.id).single()

      if (!adminRole) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin/unauthorized"
        return NextResponse.redirect(url)
      }
    }

    // If admin user tries to access regular auth pages, redirect to admin dashboard
    if (user && (request.nextUrl.pathname.startsWith("/auth/") || request.nextUrl.pathname === "/dashboard")) {
      const { data: adminRole } = await supabase.from("admin_roles").select("role").eq("user_id", user.id).single()

      if (adminRole) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin/dashboard"
        return NextResponse.redirect(url)
      }
    }

    return supabaseResponse
  }

  if (isPublicPath) {
    return supabaseResponse
  }

  // Only check authentication for protected paths
  if (isProtectedPath) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    const { data: adminRole } = await supabase.from("admin_roles").select("role").eq("user_id", user.id).single()

    if (adminRole) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthPath && !request.nextUrl.pathname.startsWith("/auth/onboarding")) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: adminRole } = await supabase.from("admin_roles").select("role").eq("user_id", user.id).single()

      const url = request.nextUrl.clone()
      url.pathname = adminRole ? "/admin/dashboard" : "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
