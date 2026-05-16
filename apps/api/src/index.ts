import express from 'express'
import { usersRouter } from './routes/users.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/users', usersRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`)
})
