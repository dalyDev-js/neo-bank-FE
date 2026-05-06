import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const maxDuration = 60

const SPRING_API_URL = process.env.SPRING_API_URL ?? "http://localhost:8080"

export async function GET() {
  const token = (await cookies()).get("neobank_token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const upstream = await fetch(`${SPRING_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    if (!upstream.ok) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await upstream.json()
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 503 })
  }
}
