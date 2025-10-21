import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Define role-based access rules
    const roleAccess = {
      '/admin': ['ADMIN'],
      '/teacher': ['TEACHER', 'ADMIN'],
      '/student': ['STUDENT', 'ADMIN'],
      '/dashboard': ['STUDENT', 'TEACHER', 'ADMIN']
    }

    // Check if the path requires specific roles
    for (const [protectedPath, allowedRoles] of Object.entries(roleAccess)) {
      if (path.startsWith(protectedPath)) {
        if (!token || !allowedRoles.includes(token.role as string)) {
          // Redirect to appropriate dashboard based on user role
          if (token?.role === 'STUDENT') {
            return NextResponse.redirect(new URL('/student', req.url))
          } else if (token?.role === 'TEACHER') {
            return NextResponse.redirect(new URL('/teacher', req.url))
          } else if (token?.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin', req.url))
          }
          // If no role, redirect to login
          return NextResponse.redirect(new URL('/login', req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // For all protected routes, check if the user has a valid token
        return !!token
      }
    },
    pages: {
      signIn: "/login"
    }
  }
)

// Protect all routes except public pages and auth endpoints
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - login (login page)
     * - register (registration page)
     * - / (home page)
     * - /plans (plans page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|login|register|plans|_next/static|_next/image|favicon.ico|public|$).*)"
  ]
}