import { authMiddleware } from "@clerk/nextjs"

// export default (req, _res: any) => {
//     return NextResponse.next(req)
// }
export default authMiddleware({
    publicRoutes: ["/"],
    // publicRoutes: ["/login", "/register", "/forgot-password"],
    ignoredRoutes: ["/api/hello", "/api/bulk/recipe/generate", "/api/bulk/recipe/upload", "/api/bulk/partner/generate", "/api/bulk/partner/upload"],
})

// Stop Middleware running on static files
export const config = {
    matcher: [
        /*
         * Match request paths except for the ones starting with:
         * - _next
         * - static (static files)
         * - favicon.ico (favicon file)
         *
         * This includes images, and requests from TRPC.
         */
        "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico|api/webhooks/user).*)",
    ],
}
