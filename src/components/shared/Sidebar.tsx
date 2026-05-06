"use client"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, segment: "dashboard" },
  { href: "/accounts", label: "Accounts", icon: CreditCard, segment: "accounts" },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight, segment: "transactions" },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const segment = useSelectedLayoutSegment()

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "?"

  return (
    <aside
      className="hidden md:flex h-full w-60 flex-col"
      style={{
        background: "oklch(0.07 0.022 265)",
        borderRight: "1px solid oklch(1 0 0 / 7%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-7 pb-6">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 emerald-glow"
          style={{ background: "oklch(0.73 0.18 152)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M7 2v10M4 4l6 6M10 4l-6 6"
              stroke="oklch(0.07 0.015 152)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-heading font-bold text-base leading-none tracking-tight text-foreground">
            NeoBank
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "oklch(0.40 0.025 265)" }}>
            PRIVATE BANKING
          </p>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "oklch(0.35 0.02 265)" }}>
          Navigation
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navLinks.map(({ href, label, icon: Icon, segment: seg }) => {
          const isActive = segment === seg
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "nav-active text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground ml-0.5"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{label}</span>
              {isActive && (
                <div
                  className="ml-auto h-1.5 w-1.5 rounded-full"
                  style={{ background: "oklch(0.73 0.18 152)" }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom — user info */}
      <div
        className="mx-3 mb-4 rounded-xl p-3"
        style={{
          background: "oklch(1 0 0 / 4%)",
          border: "1px solid oklch(1 0 0 / 7%)",
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback
              className="text-xs font-semibold"
              style={{
                background: "oklch(0.73 0.18 152 / 20%)",
                color: "oklch(0.73 0.18 152)",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-foreground">
              {user ? `${user.firstName} ${user.lastName}` : "—"}
            </p>
            <p className="text-[10px] truncate" style={{ color: "oklch(0.40 0.025 265)" }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-white/8"
            style={{ color: "oklch(0.40 0.025 265)" }}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
