"use client"

import { useSelectedLayoutSegment } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const titleMap: Record<string, string> = {
  dashboard: "Dashboard",
  accounts: "My Accounts",
  transactions: "Transactions",
}

const descriptionMap: Record<string, string> = {
  dashboard: "Overview of your financial activity",
  accounts: "Manage your bank accounts",
  transactions: "Track your transaction history",
}

export function Navbar() {
  const segment = useSelectedLayoutSegment()
  const { user } = useAuth()
  const title = segment ? (titleMap[segment] ?? "NeoBank") : "NeoBank"
  const description = segment ? (descriptionMap[segment] ?? "") : ""

  return (
    <header
      className="flex h-16 items-center justify-between px-6 shrink-0"
      style={{
        borderBottom: "1px solid oklch(1 0 0 / 7%)",
        background: "oklch(0.09 0.022 265 / 80%)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div>
        <h2 className="font-heading text-base font-bold tracking-tight leading-none text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "oklch(0.45 0.025 265)" }}>
            {description}
          </p>
        )}
      </div>

      {user && (
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{
            background: "oklch(1 0 0 / 5%)",
            border: "1px solid oklch(1 0 0 / 8%)",
            color: "oklch(0.52 0.03 265)",
          }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: "oklch(0.73 0.18 152)" }}
          />
          {user.firstName} {user.lastName}
        </div>
      )}
    </header>
  )
}
