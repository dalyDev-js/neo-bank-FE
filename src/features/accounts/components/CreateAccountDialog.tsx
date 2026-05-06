"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useCreateAccount } from "@/features/accounts/hooks/useAccounts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getErrorMessage } from "@/lib/utils"
import type { AccountType } from "@/types"

interface CreateAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAccountDialog({ open, onOpenChange }: CreateAccountDialogProps) {
  const [type, setType] = useState<AccountType>("SAVINGS")
  const createAccount = useCreateAccount()

  async function handleCreate() {
    try {
      const account = await createAccount.mutateAsync({ type })
      toast.success(`Account ${account.accountNumber} created successfully`)
      onOpenChange(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Account</DialogTitle>
          <DialogDescription>Choose the type of account you&apos;d like to open.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label>Account Type</Label>
          <Select value={type} onValueChange={(v) => { if (v !== null) setType(v as AccountType) }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SAVINGS">Savings</SelectItem>
              <SelectItem value="CURRENT">Current</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={createAccount.isPending}>
            {createAccount.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Create Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
