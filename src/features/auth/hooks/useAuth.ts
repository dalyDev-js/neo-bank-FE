import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { login, register, getMyActivity } from "@/features/auth/services/auth.service"
import type { LoginRequest, RegisterRequest, UserResponse } from "@/types"

export function useLogin() {
  return useMutation<{ user: UserResponse }, Error, LoginRequest>({
    mutationFn: (data: LoginRequest) => login(data),
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  })
}

export function useAuditLog(page = 0) {
  return useQuery({
    queryKey: ["audit", page],
    queryFn: () => getMyActivity(page, 10),
  })
}

export function useAuditLogSuspense(page = 0) {
  return useSuspenseQuery({
    queryKey: ["audit", page],
    queryFn: () => getMyActivity(page, 10),
  })
}
