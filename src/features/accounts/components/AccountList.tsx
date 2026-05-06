"use client"

import { CreditCard } from "lucide-react"
import { useAccountsSuspense } from "@/features/accounts/hooks/useAccounts"
import { AccountCard } from "@/features/accounts/components/AccountCard"
import { EmptyState } from "@/components/shared/EmptyState"

export function AccountList({ onCreateClick }: { onCreateClick: () => void }) {
  const { data: accounts } = useAccountsSuspense()

  if (!accounts || accounts.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No accounts yet"
        description="Create your first account to get started."
        action={{ label: "Create Account", onClick: onCreateClick }}
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
