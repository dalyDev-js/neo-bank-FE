import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SPRING_API_URL = process.env.SPRING_API_URL ?? "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const upstream = await fetch(`${SPRING_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status })
    }

    const response = NextResponse.json({ user: data.user })

    response.cookies.set("neobank_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.expiresIn ?? 86400,
    })

    return response
  } catch {
    return NextResponse.json({ message: "Unable to reach authentication server" }, { status: 503 })
  }
}
