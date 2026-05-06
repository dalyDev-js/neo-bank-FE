import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import {
  getAccounts,
  getAccountById,
  createAccount,
  freezeAccount,
  unfreezeAccount,
  closeAccount,
} from "@/features/accounts/services/account.service"
import type { CreateAccountRequest } from "@/types"

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
    enabled: !!id,
  })
}

export function useAccountSuspense(id: string) {
  return useSuspenseQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
  })
}

export function useAccountsSuspense() {
  return useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAccountRequest) => createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })
}

export function useFreezeAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => freezeAccount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["account", id] })
    },
  })
}

export function useUnfreezeAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unfreezeAccount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["account", id] })
    },
  })
}

export function useCloseAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => closeAccount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["account", id] })
    },
  })
}
