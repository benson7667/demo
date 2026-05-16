import { Router } from 'express'
import type { User } from '@repo/types'
import { ok, err } from '@repo/utils'

export const usersRouter: Router = Router()

// Fake in-memory store — swap for a real DB later
const users: User[] = [
  { id: '1', name: 'Alice Tan', email: 'alice@example.com', createdAt: '2024-01-15T00:00:00Z' },
  { id: '2', name: 'Bob Lim',   email: 'bob@example.com',   createdAt: '2024-03-22T00:00:00Z' },
  { id: '3', name: 'Carol Ng',  email: 'carol@example.com', createdAt: '2024-06-01T00:00:00Z' },
]

// GET /api/users
usersRouter.get('/', (_req, res) => {
  res.json(ok(users))
})

// GET /api/users/:id
usersRouter.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id)
  if (!user) {
    res.status(404).json(err('User not found', 404))
    return
  }
  res.json(ok(user))
})

// POST /api/users
usersRouter.post('/', (req, res) => {
  const { name, email } = req.body as Partial<User>
  if (!name || !email) {
    res.status(400).json(err('name and email are required', 400))
    return
  }
  const newUser: User = {
    id: String(users.length + 1),
    name,
    email,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  res.status(201).json(ok(newUser))
})
