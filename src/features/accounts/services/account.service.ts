import apiClient from "@/lib/axios"
import type { AccountResponse, CreateAccountRequest } from "@/types"

export async function getAccounts(): Promise<AccountResponse[]> {
  const res = await apiClient.get<AccountResponse[]>("/api/accounts")
  return res.data
}

export async function getAccountById(id: string): Promise<AccountResponse> {
  const res = await apiClient.get<AccountResponse>(`/api/accounts/${id}`)
  return res.data
}

export async function createAccount(
  data: CreateAccountRequest
): Promise<AccountResponse> {
  const res = await apiClient.post<AccountResponse>("/api/accounts", data)
  return res.data
}

export async function freezeAccount(id: string): Promise<AccountResponse> {
  const res = await apiClient.patch<AccountResponse>(`/api/accounts/${id}/freeze`)
  return res.data
}

export async function unfreezeAccount(id: string): Promise<AccountResponse> {
  const res = await apiClient.patch<AccountResponse>(`/api/accounts/${id}/unfreeze`)
  return res.data
}

export async function closeAccount(id: string): Promise<AccountResponse> {
  const res = await apiClient.patch<AccountResponse>(`/api/accounts/${id}/close`)
  return res.data
}
