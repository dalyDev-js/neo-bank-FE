import apiClient from "@/lib/axios"
import type {
  TransactionResponse,
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
  Page,
} from "@/types"

export async function deposit(data: DepositRequest): Promise<TransactionResponse> {
  const res = await apiClient.post<TransactionResponse>("/api/transactions/deposit", data)
  return res.data
}

export async function withdraw(data: WithdrawRequest): Promise<TransactionResponse> {
  const res = await apiClient.post<TransactionResponse>("/api/transactions/withdraw", data)
  return res.data
}

export async function transfer(data: TransferRequest): Promise<TransactionResponse> {
  const res = await apiClient.post<TransactionResponse>("/api/transactions/transfer", data)
  return res.data
}

export async function getTransactionHistory(
  accountId: string,
  page = 0,
  size = 10
): Promise<Page<TransactionResponse>> {
  const res = await apiClient.get<Page<TransactionResponse>>(
    `/api/transactions/history/${accountId}?page=${page}&size=${size}`
  )
  return res.data
}
