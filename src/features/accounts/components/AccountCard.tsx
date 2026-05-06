import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { AccountActions } from "@/features/accounts/components/AccountActions"
import { formatMoney } from "@/lib/utils"
import type { AccountResponse } from "@/types"

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "ACTIVE",
    className: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
  },
  FROZEN: {
    label: "FROZEN",
    className: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",
  },
  CLOSED: {
    label: "CLOSED",
    className: "bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/20",
  },
}

const typeConfig: Record<string, { label: string; className: string; cardClass: string }> = {
  SAVINGS: {
    label: "SAVINGS",
    className: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
    cardClass: "account-card-savings",
  },
  CURRENT: {
    label: "CURRENT",
    className: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
    cardClass: "account-card-current",
  },
}

export function AccountCard({ account }: { account: AccountResponse }) {
  const status = statusConfig[account.status] ?? statusConfig.CLOSED
  const type = typeConfig[account.type] ?? typeConfig.SAVINGS

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] ${type.cardClass}`}
      style={{
        background: "oklch(0.13 0.026 265)",
        border: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      {/* Top row: number + badges */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <p
            className="font-mono text-xs font-semibold tracking-wider"
            style={{ color: "oklch(0.45 0.025 265)" }}
          >
            {account.accountNumber}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "oklch(0.38 0.02 265)" }}>
            Opened {format(new Date(account.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${type.className}`}>
            {type.label}
          </span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "oklch(0.45 0.025 265)" }}>
          Balance
        </p>
        <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
          {formatMoney(account.balance, account.currency)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          render={<Link href={`/accounts/${account.id}`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="rounded-lg text-xs h-8 border-white/10 bg-white/5 hover:bg-white/10"
        >
          View Details
        </Button>
        <AccountActions account={account} />
      </div>
    </div>
  )
}
