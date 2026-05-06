"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useDeposit } from "@/features/transactions/hooks/useTransactions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { formatMoney, getErrorMessage } from "@/lib/utils"

const schema = z.object({
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function DepositForm({ accountId }: { accountId: string }) {
  const deposit = useDeposit()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, description: "" },
  })

  async function onSubmit(values: FormValues) {
    try {
      const tx = await deposit.mutateAsync({
        accountId,
        amount: values.amount,
        description: values.description || undefined,
      })
      toast.success(
        `Deposited ${formatMoney(tx.amount)} successfully — Ref: ${tx.referenceNumber}`
      )
      form.reset()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (EGP)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={deposit.isPending}>
          {deposit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Deposit
        </Button>
      </form>
    </Form>
  )
}
