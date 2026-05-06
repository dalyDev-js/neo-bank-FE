import type { TransactionType, TransactionStatus } from "@/types"

const typeStyles: Record<TransactionType, string> = {
  DEPOSIT: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
  WITHDRAWAL: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
  TRANSFER: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
}

const statusStyles: Record<TransactionStatus, string> = {
  COMPLETED: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
  PENDING: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",
  FAILED: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
}

export function TypeBadge({ type }: { type: TransactionType }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${typeStyles[type]}`}>
      {type}
    </span>
  )
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  )
}
