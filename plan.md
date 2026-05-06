Build a complete Next.js banking dashboard frontend for NeoBank that connects to a running Spring Boot REST API on http://localhost:8080.

## Tech Stack (use latest versions)

- Next.js (latest) with App Router and TypeScript
- Tailwind CSS (latest) + shadcn/ui (latest)
- TanStack Query (latest) for server state
- Axios (latest) for HTTP requests with JWT interceptor
- React Hook Form (latest) + Zod (latest) for form validation
- Recharts (latest) for dashboard charts
- date-fns (latest) for date formatting
- lucide-react (latest) for icons
- sonner (latest) for toast notifications
- localStorage for JWT token storage

When installing dependencies use:
npm install @tanstack/react-query@latest axios@latest react-hook-form@latest zod@latest recharts@latest date-fns@latest lucide-react@latest sonner@latest
npx shadcn@latest init

## Project Structure

src/
├── app/
│ ├── (auth)/
│ │ ├── login/
│ │ │ └── page.tsx
│ │ └── register/
│ │ └── page.tsx
│ ├── (dashboard)/
│ │ ├── layout.tsx
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ ├── accounts/
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ └── transactions/
│ │ └── page.tsx
│ ├── layout.tsx
│ ├── loading.tsx
│ ├── error.tsx
│ └── not-found.tsx
│
├── features/
│ ├── auth/
│ │ ├── components/
│ │ │ ├── LoginForm.tsx
│ │ │ └── RegisterForm.tsx
│ │ ├── hooks/
│ │ │ └── useAuth.ts
│ │ ├── services/
│ │ │ └── auth.service.ts
│ │ └── types.ts
│ │
│ ├── accounts/
│ │ ├── components/
│ │ │ ├── AccountCard.tsx
│ │ │ ├── AccountList.tsx
│ │ │ ├── CreateAccountDialog.tsx
│ │ │ └── AccountActions.tsx
│ │ ├── hooks/
│ │ │ └── useAccounts.ts
│ │ ├── services/
│ │ │ └── account.service.ts
│ │ └── types.ts
│ │
│ └── transactions/
│ ├── components/
│ │ ├── TransactionTable.tsx
│ │ ├── TransactionBadge.tsx
│ │ ├── DepositForm.tsx
│ │ ├── WithdrawForm.tsx
│ │ └── TransferForm.tsx
│ ├── hooks/
│ │ └── useTransactions.ts
│ ├── services/
│ │ └── transaction.service.ts
│ └── types.ts
│
├── components/
│ ├── ui/
│ └── shared/
│ ├── Sidebar.tsx
│ ├── Navbar.tsx
│ ├── StatCard.tsx
│ ├── LoadingSkeleton.tsx
│ └── EmptyState.tsx
│
├── lib/
│ ├── axios.ts
│ ├── queryClient.ts
│ └── utils.ts
│
├── context/
│ └── AuthContext.tsx
│
├── types/
│ └── index.ts
│
└── middleware.ts

## Backend API — Base URL: http://localhost:8080

All protected endpoints require header: Authorization: Bearer <token>
CORS is configured for http://localhost:3000

---

## AUTH ENDPOINTS (public — no token needed)

### POST /api/auth/login

Request body:
{
"email": "string",
"password": "string"
}

Success response 200:
{
"accessToken": "eyJhbGciOiJIUzM4NCJ9...",
"refreshToken": "eyJhbGciOiJIUzM4NCJ9...",
"tokenType": "Bearer",
"expiresIn": 86400,
"user": {
"id": "uuid",
"firstName": "string",
"lastName": "string",
"email": "string",
"phoneNumber": "string",
"dateOfBirth": "2000-01-01",
"role": "ROLE_USER",
"active": true,
"emailVerified": false,
"createdAt": "2026-05-04T10:00:00"
}
}

Error 401:
{
"timestamp": "2026-05-04T10:00:00",
"status": 401,
"error": "Unauthorized",
"message": "Invalid email or password",
"path": "/api/auth/login"
}

---

### POST /api/users/register

Request body:
{
"firstName": "string", // min 2, max 50 chars
"lastName": "string", // min 2, max 50 chars
"email": "string", // valid email
"password": "string", // min 8 chars, must have uppercase, lowercase, number, special char
"phoneNumber": "string", // matches ^\+?[0-9]{10,15}$
"dateOfBirth": "2000-01-01", // optional
"nationalId": "string" // optional
}

Success response 201:
{
"id": "uuid",
"firstName": "string",
"lastName": "string",
"email": "string",
"phoneNumber": "string",
"dateOfBirth": null,
"role": "ROLE_USER",
"active": true,
"emailVerified": false,
"createdAt": "2026-05-04T10:00:00"
}

Error 409 (duplicate email):
{
"timestamp": "2026-05-04T10:00:00",
"status": 409,
"error": "Conflict",
"message": "Email already registered",
"path": "/api/users/register"
}

Error 400 (validation failed):
{
"timestamp": "2026-05-04T10:00:00",
"status": 400,
"error": "Validation Failed",
"fieldErrors": {
"email": "Invalid email format",
"password": "Password must be at least 8 characters",
"firstName": "First name is required"
},
"path": "/api/users/register"
}

---

## ACCOUNT ENDPOINTS (protected — token required)

### GET /api/accounts

Returns all accounts for logged in user.

Success response 200 (array):
[
{
"id": "uuid",
"accountNumber": "NB1234567890",
"type": "SAVINGS", // "SAVINGS" | "CURRENT"
"status": "ACTIVE", // "ACTIVE" | "FROZEN" | "CLOSED"
"balance": 5000.0000,
"currency": "EGP",
"dailyTransferLimit": 50000.0000,
"ownerName": "Abdulrhman ElDaly",
"createdAt": "2026-05-04T10:00:00"
}
]

Returns empty array [] if no accounts.

---

### GET /api/accounts/:id

Returns single account by ID.

Success response 200: same shape as above (single object not array)

Error 404:
{
"timestamp": "2026-05-04T10:00:00",
"status": 404,
"error": "Not Found",
"message": "Account not found with id: uuid",
"path": "/api/accounts/uuid"
}

Error 403 (not your account):
{
"timestamp": "2026-05-04T10:00:00",
"status": 403,
"error": "Forbidden",
"message": "Access denied",
"path": "/api/accounts/uuid"
}

---

### POST /api/accounts

Create a new account.

Request body:
{
"type": "SAVINGS" // "SAVINGS" | "CURRENT"
}

Success response 201: same AccountResponse shape

Error 400 (max accounts reached):
{
"timestamp": "2026-05-04T10:00:00",
"status": 400,
"error": "Bad Request",
"message": "Maximum of 3 accounts allowed per user",
"path": "/api/accounts"
}

---

### PATCH /api/accounts/:id/freeze

No request body needed.
Success response 200: AccountResponse with status "FROZEN"

Error 400 (already closed):
{
"message": "Cannot freeze a closed account"
}

---

### PATCH /api/accounts/:id/unfreeze

No request body needed.
Success response 200: AccountResponse with status "ACTIVE"

---

### PATCH /api/accounts/:id/close

No request body needed.
Success response 200: AccountResponse with status "CLOSED"

Error 400 (has balance):
{
"message": "Cannot close account with remaining balance"
}

---

## TRANSACTION ENDPOINTS (protected — token required)

### POST /api/transactions/deposit

Request body:
{
"accountId": "uuid",
"amount": 1000.00, // must be > 0
"description": "string" // optional
}

Success response 200:
{
"id": "uuid",
"referenceNumber": "TXN202605041234567",
"type": "DEPOSIT",
"status": "COMPLETED",
"amount": 1000.0000,
"fee": 0,
"sourceAccountNumber": null,
"destinationAccountNumber": "NB1234567890",
"balanceAfter": null,
"description": "Initial deposit",
"createdAt": "2026-05-04T10:00:00"
}

Error 400:
{
"message": "Account is not active"
}
or
{
"message": "Amount must be greater than zero"
}

---

### POST /api/transactions/withdraw

Request body:
{
"accountId": "uuid",
"amount": 500.00,
"description": "string"
}

Success response 200:
{
"id": "uuid",
"referenceNumber": "TXN202605041234568",
"type": "WITHDRAWAL",
"status": "COMPLETED",
"amount": 500.0000,
"fee": 0,
"sourceAccountNumber": "NB1234567890",
"destinationAccountNumber": null,
"balanceAfter": null,
"description": "ATM withdrawal",
"createdAt": "2026-05-04T10:00:00"
}

Error 400:
{
"message": "Insufficient balance"
}

---

### POST /api/transactions/transfer

Request body:
{
"sourceAccountId": "uuid",
"destinationAccountNumber": "NB9876543210",
"amount": 1000.00,
"description": "string"
}

Success response 200:
{
"id": "uuid",
"referenceNumber": "TXN202605041234569",
"type": "TRANSFER",
"status": "COMPLETED",
"amount": 1000.0000,
"fee": 0,
"sourceAccountNumber": "NB1234567890",
"destinationAccountNumber": "NB9876543210",
"balanceAfter": 4000.0000,
"description": "Transfer to savings",
"createdAt": "2026-05-04T10:00:00"
}

Error 400:
{
"message": "Insufficient balance"
}
or
{
"message": "Source account is not active"
}
or
{
"message": "Destination account is not active"
}
or
{
"message": "Cannot transfer to the same account"
}
or
{
"message": "Amount must be greater than zero"
}

Error 404:
{
"message": "Account not found: NB9876543210"
}

---

### GET /api/transactions/history/:accountId?page=0&size=10

Returns paginated transaction history for an account.

Query params:

- page: number (0-indexed, default 0)
- size: number (default 10)

Success response 200 (Spring Page object):
{
"content": [
{
"id": "uuid",
"referenceNumber": "TXN202605041234567",
"type": "DEPOSIT",
"status": "COMPLETED",
"amount": 1000.0000,
"fee": 0,
"sourceAccountNumber": null,
"destinationAccountNumber": "NB1234567890",
"balanceAfter": null,
"description": "Initial deposit",
"createdAt": "2026-05-04T10:00:00"
}
],
"pageable": {
"pageNumber": 0,
"pageSize": 10,
"sort": { "sorted": true, "unsorted": false, "empty": false },
"offset": 0,
"paged": true,
"unpaged": false
},
"totalElements": 25,
"totalPages": 3,
"last": false,
"first": true,
"size": 10,
"number": 0,
"numberOfElements": 10,
"empty": false,
"sort": { "sorted": true, "unsorted": false, "empty": false }
}

---

## AUDIT ENDPOINT (protected — token required)

### GET /api/audit/my-activity?page=0&size=10

Returns paginated audit log for logged in user.

Success response 200 (Spring Page object):
{
"content": [
{
"id": "uuid",
"userId": "uuid",
"action": "DEPOSIT",
"entityType": "Account",
"entityId": "uuid",
"description": "Deposited 1000 EGP",
"ipAddress": null,
"createdAt": "2026-05-04T10:00:00"
}
],
"totalElements": 5,
"totalPages": 1,
"first": true,
"last": true,
"size": 10,
"number": 0,
"empty": false
}

---

## STANDARD ERROR RESPONSE SHAPE

All errors follow this shape:
{
"timestamp": "2026-05-04T10:00:00",
"status": 400,
"error": "Bad Request",
"message": "Human readable message",
"path": "/api/..."
}

Validation errors have this shape instead:
{
"timestamp": "2026-05-04T10:00:00",
"status": 400,
"error": "Validation Failed",
"fieldErrors": {
"fieldName": "error message"
},
"path": "/api/..."
}

HTTP Status codes used:

- 200 OK — successful read or update
- 201 Created — successful creation
- 400 Bad Request — business rule violation or validation error
- 401 Unauthorized — wrong credentials or expired token
- 403 Forbidden — authenticated but not authorized (not your resource)
- 404 Not Found — resource doesn't exist
- 409 Conflict — duplicate resource (email already exists)
- 500 Internal Server Error — unexpected server error

---

## TypeScript Types

// types/index.ts

// --- Enums ---
type AccountType = "SAVINGS" | "CURRENT"
type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED"
type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER"
type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED"
type UserRole = "ROLE_USER" | "ROLE_ADMIN"

// --- Auth ---
interface LoginRequest {
email: string
password: string
}

interface RegisterRequest {
firstName: string
lastName: string
email: string
password: string
phoneNumber: string
dateOfBirth?: string
nationalId?: string
}

interface UserResponse {
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

interface AuthResponse {
accessToken: string
refreshToken: string
tokenType: string
expiresIn: number
user: UserResponse
}

// --- Accounts ---
interface AccountResponse {
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

interface CreateAccountRequest {
type: AccountType
}

// --- Transactions ---
interface TransactionResponse {
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

interface TransferRequest {
sourceAccountId: string
destinationAccountNumber: string
amount: number
description?: string
}

interface DepositRequest {
accountId: string
amount: number
description?: string
}

interface WithdrawRequest {
accountId: string
amount: number
description?: string
}

// --- Audit ---
interface AuditLogResponse {
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
interface Page<T> {
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
interface ErrorResponse {
timestamp: string
status: number
error: string
message: string
path: string
}

interface ValidationErrorResponse {
timestamp: string
status: number
error: string
fieldErrors: Record<string, string>
path: string
}

---

## Axios Setup (lib/axios.ts)

- Create axios instance with baseURL: http://localhost:8080
- Request interceptor: read token from localStorage key "neobank_token"
  attach as header: Authorization: Bearer <token>
- Response interceptor:
  - if status 401 → clear "neobank_token" from localStorage → window.location.href = "/login"
  - extract error message from response.data.message for all other errors

---

## Auth Flow

- Token stored in localStorage as "neobank_token"
- User object stored in localStorage as "neobank_user" (JSON stringified UserResponse)
- AuthContext provides:
  - user: UserResponse | null
  - token: string | null
  - isAuthenticated: boolean
  - login(data: AuthResponse): void — saves token + user to localStorage + context
  - logout(): void — clears localStorage + redirects to /login
- middleware.ts: protect all /dashboard/\* routes, redirect to /login if no token

---

## Pages

### /login

- Email + password form
- Zod: email valid format, password min 8 chars
- On success: call login() from AuthContext → redirect to /dashboard
- On 401: toast "Invalid email or password"
- Link to /register

### /register

- firstName, lastName, email, password, phoneNumber
- Optional: dateOfBirth
- Zod validation matching backend rules:
  - firstName/lastName: min 2 max 50
  - email: valid
  - password: min 8, regex (?=._[a-z])(?=._[A-Z])(?=._\d)(?=._[@$!%*?&])
  - phoneNumber: regex ^\+?[0-9]{10,15}$
- On 201: redirect to /login + success toast
- On 409: toast "Email already registered"
- On 400 validation: show fieldErrors under each field
- Link to /login

### /dashboard

- "Good morning/afternoon/evening, {firstName}" based on time
- Stats row (4 cards):
  - Total Balance: sum of all account balances formatted as EGP
  - Active Accounts: count of ACTIVE accounts
  - Total Deposits: sum of all DEPOSIT transactions this month
  - Total Withdrawals: sum of all WITHDRAWAL transactions this month
- Bar chart (Recharts): last 10 transactions, x=referenceNumber shortened, y=amount, fill color by type
- Recent Activity: last 5 audit log entries
- Quick actions: Deposit, Withdraw, Transfer buttons opening dialogs

### /accounts

- "My Accounts" header + "New Account" button
- Grid of AccountCard components:
  - Shows: accountNumber, type badge, status badge, balance, currency, createdAt
  - Status badge colors: ACTIVE=green, FROZEN=amber, CLOSED=slate
  - Type badge: SAVINGS=blue, CURRENT=purple
  - Actions: View Details, Freeze/Unfreeze (toggle), Close (with confirm dialog)
- New Account dialog: select SAVINGS or CURRENT → POST /api/accounts
- Empty state if no accounts: "No accounts yet. Create your first account."

### /accounts/[id]

- Account header: number, type, status, balance in large text
- Three tabs: Deposit | Withdraw | Transfer
  - Deposit: amount (min 0.01) + description → POST /api/transactions/deposit
  - Withdraw: amount (min 0.01) + description → POST /api/transactions/withdraw
  - Transfer: destinationAccountNumber + amount + description → POST /api/transactions/transfer
- Transaction History table below tabs (TanStack Table):
  - Columns: Date | Reference | Type | Amount | Balance After | Status | Description
  - Type badge colored: DEPOSIT=green, WITHDRAWAL=red, TRANSFER=blue
  - Amount: green with + for DEPOSIT, red with - for WITHDRAWAL/TRANSFER
  - Pagination: page selector, prev/next, showing "X of Y pages"
  - Page size selector: 10, 20, 50

### /transactions

- Full history across all accounts combined
- TanStack Table same columns + Account Number column
- Filter tabs: ALL | DEPOSIT | WITHDRAWAL | TRANSFER
- Pagination

### Dashboard Layout

- Left sidebar (collapsible on mobile):
  - NeoBank logo + tagline
  - Navigation:
    - Dashboard → /dashboard (LayoutDashboard icon)
    - Accounts → /accounts (CreditCard icon)
    - Transactions → /transactions (ArrowLeftRight icon)
  - Bottom: user avatar + name + Logout button (LogOut icon)
- Top navbar: page title + breadcrumb
- Mobile: sidebar becomes sheet/drawer

---

## Money Formatting

const formatMoney = (amount: number, currency = "EGP") =>
new Intl.NumberFormat("en-EG", {
minimumFractionDigits: 2,
maximumFractionDigits: 2,
}).format(amount) + " " + currency

Examples:

- 5000 → "5,000.00 EGP"
- 1000.5 → "1,000.50 EGP"
- 0 → "0.00 EGP"

## Date Formatting

import { format } from "date-fns"
format(new Date(dateString), "MMM d, yyyy HH:mm")
// "May 4, 2026 10:30"

Relative time for audit log:
import { formatDistanceToNow } from "date-fns"
formatDistanceToNow(new Date(dateString), { addSuffix: true })
// "2 hours ago"

---

## Error Handling Strategy

All API calls wrapped in try/catch. Errors handled as follows:

1. 401 → axios interceptor handles automatically (logout + redirect)
2. 409 → toast.error(response.data.message)
3. 400 with message → toast.error(response.data.message)
4. 400 with fieldErrors → set form errors using React Hook Form setError()
5. 404 → toast.error("Resource not found")
6. 403 → toast.error("You don't have permission to do this")
7. 500 → toast.error("Something went wrong. Please try again.")
8. Network error → toast.error("Cannot connect to server. Check your connection.")

Helper function to extract error message:
const getErrorMessage = (error: unknown): string => {
if (axios.isAxiosError(error)) {
return error.response?.data?.message ?? "Something went wrong"
}
return "Something went wrong"
}

---

## React Query Setup

Query keys:

- ["accounts"] → all accounts list
- ["account", id] → single account
- ["transactions", accountId, page, size] → paginated transactions
- ["audit", page] → audit log
- ["user"] → current user

After mutations invalidate:

- deposit/withdraw/transfer → invalidate ["accounts"] and ["transactions", accountId]
- freeze/unfreeze/close → invalidate ["accounts"] and ["account", id]
- register → no invalidation needed

Show success toasts after mutations:

- deposit: "Deposited {amount} successfully — Ref: {referenceNumber}"
- withdraw: "Withdrawn {amount} successfully — Ref: {referenceNumber}"
- transfer: "Transfer of {amount} completed — Ref: {referenceNumber}"
- freeze: "Account frozen successfully"
- unfreeze: "Account activated successfully"
- create account: "Account {accountNumber} created successfully"

---

## Loading States

- Use shadcn Skeleton component for loading states
- Show skeletons that match the shape of the actual content
- Buttons show spinner + disabled during form submission
- Full page loader on initial auth check

## Empty States

- No accounts: show CreditCard icon + "No accounts yet" + "Create Account" button
- No transactions: show ArrowLeftRight icon + "No transactions yet"
- No audit logs: show ClipboardList icon + "No activity yet"

---

## shadcn Components to Install

Run: npx shadcn@latest add button card dialog form input label select badge skeleton table tabs avatar dropdown-menu separator sheet alert tooltip

---

## Important Implementation Notes

- "use client" only on components that use: useState, useEffect, event handlers, browser APIs
- Keep page.tsx files as server components — pass data down to client components
- middleware.ts at src/ level using Next.js middleware for route protection
- Add loading.tsx inside each route group for automatic Suspense boundaries
- Add error.tsx inside each route group for automatic error boundaries
- All forms reset after successful submission
- Confirm dialog before destructive actions (close account)
- The backend returns dates as ISO strings: "2026-05-04T10:00:00" — always parse with new Date()
- BigDecimal from Java serializes to number in JSON — treat as number in TypeScript
- UUID from Java serializes to string in JSON — always string in TypeScript
- Backend CORS is configured for http://localhost:3000 only
- Do NOT use any mock data — connect to real API from the start
- Add @tanstack/react-query DevTools in development only
