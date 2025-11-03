import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Allow access to login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};