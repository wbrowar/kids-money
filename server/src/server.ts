import cors from 'cors'
import express from 'express'
import { loadEnvFile } from 'node:process'
import { login } from '@/api/login.ts'
import { getKids } from '@/api/get-kids.ts'
import { getUsers } from '@/api/get-users.ts'
import { createUpdateKid } from '@/api/create-update-kid.ts'
import { createAdjustment } from '@/api/create-adjustment.ts'
import { removeKid } from '@/api/remove-kid.ts'
import { ServerRoute } from '@/constants/constants.ts'
import { updateUser } from '@/api/update-user.ts'
import { ping } from '@/api/ping.ts'

loadEnvFile()

const app = express()
const port = process.env.SERVER_PORT
const corsOrigin = process.env.CORS_ORIGIN ?? ''

app.use(express.json())

if (corsOrigin) {
  app.use(
    cors({
      origin: corsOrigin,
    })
  )
}

app.get(ServerRoute.Ping, ping)
app.post(ServerRoute.CreateAdjustment, createAdjustment)
app.post(ServerRoute.CreateUpdateKid, createUpdateKid)
app.post(ServerRoute.GetKids, getKids)
app.post(ServerRoute.GetUsers, getUsers)
app.post(ServerRoute.Login, login)
app.post(ServerRoute.RemoveKid, removeKid)
app.post(ServerRoute.UpdateUser, updateUser)

app.listen(port, () => {
  console.log(`Kids Money listening on port ${port}`)
})
