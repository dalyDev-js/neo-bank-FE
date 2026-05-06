import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedPaths = ["/dashboard", "/accounts", "/transactions"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected) {
    const token = request.cookies.get("neobank_token")?.value
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
