import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const SPRING_API_URL = process.env.SPRING_API_URL ?? "http://localhost:8080"

type Params = { params: Promise<{ path: string[] }> }

async function handler(request: NextRequest, { params }: Params) {
  const { path } = await params
  const token = (await cookies()).get("neobank_token")?.value

  const upstreamUrl = new URL(`/${path.join("/")}`, SPRING_API_URL)
  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD"
  const body = hasBody ? await request.text() : undefined

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    })

    const text = await upstream.text()

    return new NextResponse(text || null, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json({ message: "Unable to reach API server" }, { status: 503 })
  }
}

export const maxDuration = 60

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
