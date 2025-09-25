import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // For all protected routes, check if the user has a valid token
      return !!token
    }
  },
  pages: {
    signIn: "/login"
  }
})

// Protect all routes except login, api/auth, and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - login (login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|public).*)"
  ]
}