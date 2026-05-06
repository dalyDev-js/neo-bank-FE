"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatDistanceToNow } from "date-fns"
import {
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ClipboardList,
} from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { useAccountsSuspense } from "@/features/accounts/hooks/useAccounts"
import { useAuditLogSuspense } from "@/features/auth/hooks/useAuth"
import { useTransactionHistorySuspense } from "@/features/transactions/hooks/useTransactions"
import { StatCard } from "@/components/shared/StatCard"
import { EmptyState } from "@/components/shared/EmptyState"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DepositForm } from "@/features/transactions/components/DepositForm"
import { WithdrawForm } from "@/features/transactions/components/WithdrawForm"
import { TransferForm } from "@/features/transactions/components/TransferForm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatMoney } from "@/lib/utils"

function greeting(firstName: string) {
  const hour = new Date().getHours()
  const period =
    hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"
  return `Good ${period}, ${firstName}`
}

const barColors: Record<string, string> = {
  DEPOSIT: "#16a34a",
  WITHDRAWAL: "#dc2626",
  TRANSFER: "#2563eb",
}

export function DashboardContent() {
  const { user } = useAuth()
  const { data: accounts } = useAccountsSuspense()
  const { data: auditData } = useAuditLogSuspense(0)

  const firstActiveAccount = accounts?.find((a) => a.status === "ACTIVE")
  const { data: txData } = useTransactionHistorySuspense(firstActiveAccount?.id ?? "", 0, 10)

  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")

  const activeAccounts = accounts?.filter((a) => a.status === "ACTIVE") ?? []
  const effectiveAccountId = selectedAccountId || firstActiveAccount?.id || ""

  const totalBalance = accounts?.reduce((s, a) => s + a.balance, 0) ?? 0
  const activeCount = activeAccounts.length

  const now = new Date()
  const thisMonth = txData?.content.filter((tx) => {
    const d = new Date(tx.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }) ?? []
  const totalDeposits = thisMonth
    .filter((t) => t.type === "DEPOSIT")
    .reduce((s, t) => s + t.amount, 0)
  const totalWithdrawals = thisMonth
    .filter((t) => t.type === "WITHDRAWAL")
    .reduce((s, t) => s + t.amount, 0)

  const chartData = (txData?.content ?? []).slice(0, 10).map((tx) => ({
    name: tx.referenceNumber.slice(-6),
    amount: tx.amount,
    type: tx.type,
    fill: barColors[tx.type] ?? "#6b7280",
  }))

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          {user ? greeting(user.firstName) : "Welcome"}
        </h2>
        <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.025 265)" }}>
          Here&apos;s what&apos;s happening with your accounts today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatMoney(totalBalance)}
          icon={Wallet}
          gradient="emerald"
        />
        <StatCard
          title="Active Accounts"
          value={String(activeCount)}
          icon={CreditCard}
          gradient="blue"
        />
        <StatCard
          title="Deposits This Month"
          value={formatMoney(totalDeposits)}
          icon={TrendingUp}
          gradient="gold"
        />
        <StatCard
          title="Withdrawals This Month"
          value={formatMoney(totalWithdrawals)}
          icon={TrendingDown}
          gradient="red"
        />
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "oklch(0.13 0.026 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "oklch(0.45 0.025 265)" }}>
            Last 10 Transactions
          </p>
          {chartData.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "oklch(0.45 0.025 265)" }}>No transaction data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "oklch(0.45 0.025 265)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.45 0.025 265)" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip
                  formatter={(value) => formatMoney(Number(value))}
                  labelFormatter={(label) => `Ref: ...${label}`}
                  contentStyle={{ background: "oklch(0.13 0.026 265)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: "12px", fontSize: "12px" }}
                  cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "oklch(0.13 0.026 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "oklch(0.45 0.025 265)" }}>
            Recent Activity
          </p>
          {!auditData || auditData.empty ? (
            <EmptyState icon={ClipboardList} title="No activity yet" />
          ) : (
            <ul className="space-y-3">
              {auditData.content.slice(0, 5).map((log) => (
                <li key={log.id} className="flex items-start gap-3 text-sm">
                  <div
                    className="mt-0.5 rounded-full p-1.5 shrink-0"
                    style={{ background: "oklch(0.73 0.18 152 / 12%)" }}
                  >
                    <ClipboardList className="h-3 w-3" style={{ color: "oklch(0.73 0.18 152)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-foreground">{log.description}</p>
                    <p className="text-xs mt-0.5" style={{ color: "oklch(0.45 0.025 265)" }}>
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {activeAccounts.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "oklch(0.13 0.026 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "oklch(0.45 0.025 265)" }}>
            Quick Actions
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Account:</span>
              <Select value={effectiveAccountId} onValueChange={(v) => { if (v !== null) setSelectedAccountId(v) }}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                <DialogTrigger render={<Button variant="outline" />}>
                  <ArrowDownToLine className="mr-2 h-4 w-4" /> Deposit
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deposit</DialogTitle>
                  </DialogHeader>
                  <DepositForm accountId={effectiveAccountId} />
                </DialogContent>
              </Dialog>

              <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                <DialogTrigger render={<Button variant="outline" />}>
                  <ArrowUpFromLine className="mr-2 h-4 w-4" /> Withdraw
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw</DialogTitle>
                  </DialogHeader>
                  <WithdrawForm accountId={effectiveAccountId} />
                </DialogContent>
              </Dialog>

              <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
                <DialogTrigger render={<Button variant="outline" />}>
                  <ArrowLeftRight className="mr-2 h-4 w-4" /> Transfer
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer</DialogTitle>
                  </DialogHeader>
                  <TransferForm accountId={effectiveAccountId} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
