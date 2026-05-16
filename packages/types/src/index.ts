// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

// ─── API Response wrappers ────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: number
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
