import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  gradient?: "emerald" | "blue" | "gold" | "red"
}

const gradientStyles: Record<string, { overlay: string; iconBg: string; iconColor: string }> = {
  emerald: {
    overlay: "stat-gradient-1",
    iconBg: "oklch(0.73 0.18 152 / 15%)",
    iconColor: "oklch(0.73 0.18 152)",
  },
  blue: {
    overlay: "stat-gradient-2",
    iconBg: "oklch(0.65 0.18 240 / 15%)",
    iconColor: "oklch(0.65 0.18 240)",
  },
  gold: {
    overlay: "stat-gradient-3",
    iconBg: "oklch(0.78 0.15 80 / 15%)",
    iconColor: "oklch(0.78 0.15 80)",
  },
  red: {
    overlay: "stat-gradient-4",
    iconBg: "oklch(0.65 0.22 25 / 15%)",
    iconColor: "oklch(0.65 0.22 25)",
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  gradient = "emerald",
}: StatCardProps) {
  const style = gradientStyles[gradient]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        style.overlay
      )}
      style={{
        background: "oklch(0.13 0.026 265)",
        border: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.45 0.025 265)" }}
          >
            {title}
          </p>
          <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {description && (
            <p className="text-xs" style={{ color: "oklch(0.45 0.025 265)" }}>
              {description}
            </p>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
          style={{ background: style.iconBg }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: style.iconColor }} />
        </div>
      </div>
    </div>
  )
}
