import type { ApiResponse, User } from '@repo/types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const body = (await res.json()) as ApiResponse<T>
  if (!body.success) {
    throw new Error(body.error)
  }
  return body.data
}

export const api = {
  listUsers: () => request<User[]>('/api/users'),
  getUser: (id: string) => request<User>(`/api/users/${id}`),
  createUser: (input: Pick<User, 'name' | 'email'>) =>
    request<User>('/api/users', { method: 'POST', body: JSON.stringify(input) }),
}
