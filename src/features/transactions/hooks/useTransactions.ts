import { useMutation, useQuery, useQueryClient, useSuspenseQuery, keepPreviousData } from "@tanstack/react-query"
import {
  deposit,
  withdraw,
  transfer,
  getTransactionHistory,
} from "@/features/transactions/services/transaction.service"
import type { DepositRequest, WithdrawRequest, TransferRequest } from "@/types"

const emptyPage = { content: [], empty: true, totalPages: 0, totalElements: 0, first: true, last: true } as const

export function useTransactionHistory(
  accountId: string,
  page = 0,
  size = 10
) {
  return useQuery({
    queryKey: ["transactions", accountId, page, size],
    queryFn: () => getTransactionHistory(accountId, page, size),
    enabled: !!accountId,
  })
}

export function useTransactionHistorySuspense(accountId: string, page = 0, size = 10) {
  return useSuspenseQuery({
    queryKey: ["transactions", accountId, page, size],
    queryFn: () => accountId ? getTransactionHistory(accountId, page, size) : Promise.resolve(emptyPage),
    placeholderData: keepPreviousData,
  })
}

export function useDeposit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DepositRequest) => deposit(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.accountId] })
    },
  })
}

export function useWithdraw() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WithdrawRequest) => withdraw(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.accountId] })
    },
  })
}

export function useTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TransferRequest) => transfer(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.sourceAccountId] })
    },
  })
}
