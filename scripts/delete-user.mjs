import { PrismaClient } from '@prisma/client'
import { argv, exit } from 'process'

const prisma = new PrismaClient()

function parseArgv() {
  const args = {}

  argv.forEach((arg) => {
    if (arg.startsWith('-u=')) {
      args.username = arg.split('=')[1];
    }
  })

  return args;
}

async function main () {
  const args = parseArgv()

  if (typeof args.username === 'undefined') {
    console.error('Username argument missing. Add one using the `-u` argument:\n  node scripts/delete-user.mjs -u=my-username')
    exit(1)
  }


  const user = await prisma.user.delete({
    where: {
      username: args.username,
    },
  })

  console.log(`User delete with username: ${args.username}`)
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
