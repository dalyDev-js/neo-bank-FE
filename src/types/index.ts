// --- Enums ---
export type AccountType = "SAVINGS" | "CURRENT"
export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED"
export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER"
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED"
export type UserRole = "ROLE_USER" | "ROLE_ADMIN"

// --- Auth ---
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  dateOfBirth?: string
  nationalId?: string
}

export interface UserResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string | null
  role: UserRole
  active: boolean
  emailVerified: boolean
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserResponse
}

// --- Accounts ---
export interface AccountResponse {
  id: string
  accountNumber: string
  type: AccountType
  status: AccountStatus
  balance: number
  currency: string
  dailyTransferLimit: number
  ownerName: string
  createdAt: string
}

export interface CreateAccountRequest {
  type: AccountType
}

// --- Transactions ---
export interface TransactionResponse {
  id: string
  referenceNumber: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  fee: number
  sourceAccountNumber: string | null
  destinationAccountNumber: string | null
  balanceAfter: number | null
  description: string | null
  createdAt: string
}

export interface TransferRequest {
  sourceAccountId: string
  destinationAccountNumber: string
  amount: number
  description?: string
}

export interface DepositRequest {
  accountId: string
  amount: number
  description?: string
}

export interface WithdrawRequest {
  accountId: string
  amount: number
  description?: string
}

// --- Audit ---
export interface AuditLogResponse {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  description: string
  ipAddress: string | null
  createdAt: string
}

// --- Pagination ---
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

// --- Errors ---
export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface ValidationErrorResponse {
  timestamp: string
  status: number
  error: string
  fieldErrors: Record<string, string>
  path: string
}
