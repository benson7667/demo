import type { ApiResponse } from '@repo/types'

// ─── API helpers ─────────────────────────────────────────────────────────────
export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data }
}

export function err(error: string, code?: number): ApiResponse<never> {
  return { success: false, error, code }
}

// ─── String helpers ───────────────────────────────────────────────────────────
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/[^\w-]+/g, '')
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-SG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// ─── Object helpers ───────────────────────────────────────────────────────────
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) delete result[key]
  return result as Omit<T, K>
}
