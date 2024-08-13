
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

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

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    await supabase.auth.getSession();
    return res;
  }
  
