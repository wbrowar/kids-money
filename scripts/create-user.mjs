import { PrismaClient } from '@prisma/client'
import { argv, exit } from 'process'

const prisma = new PrismaClient()

function parseArgv() {
  const args = {}

  argv.forEach((arg) => {
    if (arg.startsWith('-u=')) {
      args.username = arg.split('=')[1];
    } else if (arg.startsWith('-p=')) {
      args.password = arg.split('=')[1];
    } else if (arg.startsWith('-admin=')) {
      args.grownUp = arg.split('=')[1] === 'true';
    }
  })

  return args;
}

async function main () {
  const args = parseArgv()

  if (typeof args.username === 'undefined') {
    console.error('Username argument missing. Add one using the `-u` argument:\n  node scripts/create-user.mjs -u=my-username. -p=my-password')
    exit(1)
  }
  if (typeof args.password === 'undefined') {
    console.error('Password argument missing. Add one using the `-p` argument:\n  node scripts/create-user.mjs -u=my-username. -p=my-password')
    exit(1)
  }


  const user = await prisma.user.create({
    data: {
      username: args.username,
      password: args.password,
      grownUp: args.grownUp || false
    },
  })

  console.log(`User created with username: ${args.username}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    exit(1)
  })
