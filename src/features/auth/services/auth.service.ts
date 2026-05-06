import apiClient from "@/lib/axios"
import type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  AuditLogResponse,
  Page,
} from "@/types"

export async function login(data: LoginRequest): Promise<{ user: UserResponse }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    const err = Object.assign(new Error(json.message ?? "Login failed"), {
      response: { status: res.status, data: json },
    })
    throw err
  }

  return json
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const res = await apiClient.post<UserResponse>("/api/users/register", data)
  return res.data
}

export async function getMyActivity(
  page = 0,
  size = 10
): Promise<Page<AuditLogResponse>> {
  const res = await apiClient.get<Page<AuditLogResponse>>(
    `/api/audit/my-activity?page=${page}&size=${size}`
  )
  return res.data
}
