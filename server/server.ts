import cors from 'cors'
import express from 'express'
import { login } from '@/api/login'
import { loadEnvFile } from 'node:process'
import { getKids } from '@/api/get-kids.ts'

loadEnvFile()

const app = express()
const port = 3000

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
)

app.post('/get-kids', getKids)
app.post('/login', login)

app.listen(port, () => {
  console.log(`Kids Money listening on port ${port}`)
})
