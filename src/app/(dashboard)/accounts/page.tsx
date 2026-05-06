"use client"

import { Suspense, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountList } from "@/features/accounts/components/AccountList"
import { CreateAccountDialog } from "@/features/accounts/components/CreateAccountDialog"
import { AccountCardSkeleton } from "@/components/shared/LoadingSkeleton"

function AccountListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => <AccountCardSkeleton key={i} />)}
    </div>
  )
}

export default function AccountsPage() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Accounts</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>
      <Suspense fallback={<AccountListSkeleton />}>
        <AccountList onCreateClick={() => setCreateOpen(true)} />
      </Suspense>
      <CreateAccountDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
