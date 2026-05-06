"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useFreezeAccount, useUnfreezeAccount, useCloseAccount } from "@/features/accounts/hooks/useAccounts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/utils"
import type { AccountResponse } from "@/types"

export function AccountActions({ account }: { account: AccountResponse }) {
  const [closeOpen, setCloseOpen] = useState(false)
  const freeze = useFreezeAccount()
  const unfreeze = useUnfreezeAccount()
  const closeAcc = useCloseAccount()

  const isClosed = account.status === "CLOSED"
  const isFrozen = account.status === "FROZEN"

  async function handleFreezeToggle() {
    try {
      if (isFrozen) {
        await unfreeze.mutateAsync(account.id)
        toast.success("Account activated successfully")
      } else {
        await freeze.mutateAsync(account.id)
        toast.success("Account frozen successfully")
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleClose() {
    try {
      await closeAcc.mutateAsync(account.id)
      toast.success("Account closed successfully")
      setCloseOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {!isClosed && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleFreezeToggle}
          disabled={freeze.isPending || unfreeze.isPending}
        >
          {(freeze.isPending || unfreeze.isPending) && (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          )}
          {isFrozen ? "Unfreeze" : "Freeze"}
        </Button>
      )}
      {!isClosed && (
        <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
          <DialogTrigger render={<Button variant="destructive" size="sm" disabled={isClosed} />}>
            Close Account
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close account?</DialogTitle>
              <DialogDescription>
                This will permanently close account {account.accountNumber}. The account must have a zero balance.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCloseOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleClose}
                disabled={closeAcc.isPending}
              >
                {closeAcc.isPending && (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                )}
                Close Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
