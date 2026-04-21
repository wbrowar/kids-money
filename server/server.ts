import cors from 'cors'
import express from 'express'
import { loadEnvFile } from 'node:process'
import { login } from '@/api/login'
import { getKids } from '@/api/get-kids.ts'
import { getUsers } from '@/api/get-users.ts'
import { createUpdateKid } from '@/api/create-update-kid.ts'
import { createAdjustment } from '@/api/create-adjustment.ts'

loadEnvFile()

const app = express()
const port = 3000

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
)

app.post(`/create-adjustment`, createAdjustment)
app.post(`/create-update-kid`, createUpdateKid)
app.post(`/get-kids`, getKids)
app.post('/get-users', getUsers)
app.post('/login', login)

app.listen(port, () => {
  console.log(`Kids Money listening on port ${port}`)
})
