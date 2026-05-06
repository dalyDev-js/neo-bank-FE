"use client";

import { Suspense } from "react";
import { useAccountSuspense } from "@/features/accounts/hooks/useAccounts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DepositForm } from "@/features/transactions/components/DepositForm";
import { WithdrawForm } from "@/features/transactions/components/WithdrawForm";
import { TransferForm } from "@/features/transactions/components/TransferForm";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatMoney } from "@/lib/utils";

const statusColors: Record<string, string> = {
  ACTIVE: "text-green-600",
  FROZEN: "text-amber-600",
  CLOSED: "text-slate-500",
};

export function AccountDetail({ id }: { id: string }) {
  const { data: account } = useAccountSuspense(id);

  if (!account)
    return <p className="text-muted-foreground">Account not found.</p>;

  return (
    <div className="space-y-6">
      {/* Account Header */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-muted-foreground">
              {account.accountNumber}
            </p>
            <p className="text-3xl font-bold mt-1">
              {formatMoney(account.balance, account.currency)}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-medium">{account.type}</p>a
            <p
              className={`text-sm font-semibold ${statusColors[account.status]}`}>
              {account.status}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Forms */}
      {account.status === "ACTIVE" && (
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="deposit">
              <TabsList className="mb-4">
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
              </TabsList>
              <TabsContent value="deposit">
                <DepositForm accountId={id} />
              </TabsContent>
              <TabsContent value="withdraw">
                <WithdrawForm accountId={id} />
              </TabsContent>
              <TabsContent value="transfer">
                <TransferForm accountId={id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <Suspense fallback={<TableSkeleton rows={10} />}>
          <TransactionTable accountId={id} />
        </Suspense>
      </div>
    </div>
  );
}
