"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
import { TypeBadge, StatusBadge } from "@/features/transactions/components/TransactionBadge"
import { formatMoney } from "@/lib/utils"
import { ArrowLeftRight } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

interface TransactionTableProps {
  accountId: string
  showAccountColumn?: boolean
}

export function TransactionTable({ accountId, showAccountColumn = false }: TransactionTableProps) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const { data } = useTransactionHistorySuspense(accountId, page, size)

  if (!data || data.empty) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="No transactions yet"
        description="Transactions will appear here once you make a deposit, withdrawal, or transfer."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              {showAccountColumn && <TableHead>Account</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Balance After</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="font-mono text-xs">{tx.referenceNumber}</TableCell>
                {showAccountColumn && (
                  <TableCell className="font-mono text-xs">
                    {tx.sourceAccountNumber || tx.destinationAccountNumber || "—"}
                  </TableCell>
                )}
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

      {/* Pagination */}
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
            Page {page + 1} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => p - 1)}
            disabled={data.first}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
