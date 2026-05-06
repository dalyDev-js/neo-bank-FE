"use client"

import { useState } from "react"
import { useAccountsSuspense } from "@/features/accounts/hooks/useAccounts"
import { useTransactionHistorySuspense } from "@/features/transactions/hooks/useTransactions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TypeBadge, StatusBadge } from "@/features/transactions/components/TransactionBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatMoney } from "@/lib/utils"
import { format } from "date-fns"
import { ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react"
import type { TransactionType, TransactionResponse } from "@/types"

type Filter = "ALL" | TransactionType

export function TransactionsContent() {
  const [filter, setFilter] = useState<Filter>("ALL")
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const { data: accounts } = useAccountsSuspense()
  const firstAccountId = accounts?.[0]?.id ?? ""
  const { data: txData } = useTransactionHistorySuspense(firstAccountId, page, size)

  const filtered: TransactionResponse[] = (txData?.content ?? []).filter(
    (tx) => filter === "ALL" || tx.type === filter
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      <Tabs value={filter} onValueChange={(v) => { setFilter(v as Filter); setPage(0) }}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="DEPOSIT">Deposits</TabsTrigger>
          <TabsTrigger value="WITHDRAWAL">Withdrawals</TabsTrigger>
          <TabsTrigger value="TRANSFER">Transfers</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="No transactions yet" />
      ) : (
        <>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance After</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{tx.referenceNumber}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {tx.sourceAccountNumber || tx.destinationAccountNumber || "—"}
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={tx.type} />
                    </TableCell>
                    <TableCell
                      className={`font-medium ${
                        tx.type === "DEPOSIT" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "DEPOSIT" ? "+" : "-"}
                      {formatMoney(tx.amount)}
                    </TableCell>
                    <TableCell>
                      {tx.balanceAfter != null ? formatMoney(tx.balanceAfter) : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {tx.description || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page:</span>
              <Select
                value={String(size)}
                onValueChange={(v) => { if (v !== null) { setSize(Number(v)); setPage(0) } }}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {txData?.totalPages ?? 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => p - 1)}
                disabled={txData?.first ?? true}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => p + 1)}
                disabled={txData?.last ?? true}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
