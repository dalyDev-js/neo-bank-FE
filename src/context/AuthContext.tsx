"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { UserResponse } from "@/types"

interface AuthContextValue {
  user: UserResponse | null
  isAuthenticated: boolean
  login: (user: UserResponse) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserResponse | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then(({ user }) => setUser(user ?? null))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  function login(user: UserResponse) {
    setUser(user)
    router.push("/dashboard")
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/login")
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "oklch(0.09 0.022 265)" }}>
        <div className="h-6 w-6 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "oklch(0.73 0.18 152)" }} />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
