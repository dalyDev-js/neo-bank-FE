import { Suspense } from "react"
import { TransactionsContent } from "@/features/transactions/components/TransactionsContent"
import { TableSkeleton } from "@/components/shared/LoadingSkeleton"

function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transaction History</h2>
      <TableSkeleton rows={10} />
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsContent />
    </Suspense>
  )
}
